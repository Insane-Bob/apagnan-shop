import { Controller } from '../../Core/Controller.js'
import { UserPolicy } from '../Policies/UserPolicy.js'
import { OrderValidator } from '../../Validator/OrderValidator.js'
import { Database } from '../../Models/index.js'
import { PaymentServices } from '../../Services/PaymentServices.js'
import { AskForRefundValidator } from '../../Validator/AskForRefundValidator.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'
import { OrderPolicy } from '../Policies/OrderPolicy.js'
import { SearchRequest } from '../../lib/SearchRequest.js'
import {
    BadRequestException,
    ForbiddenException,
    NotFoundException,
} from '../../Exceptions/HTTPException.js'
import { USER_ROLES } from '../../Models/SQL/user.js'
import { OrderDetailsServices } from '../../Services/OrderDetailsServices.js'
import { OrderStatus } from '../../Enums/OrderStatus.js'
import { UserBasketServices } from '../../Services/UserBasketServices.js'
import { OrderDenormalizationTask } from '../../lib/Denormalizer/tasks/OrderDenormalizationTask.js'
import { OrderServices } from '../../Services/OrderServices.js'
import { PaymentStatus } from '../../Models/SQL/payment.js'
import Sequelize, { Op } from 'sequelize'

export class OrderController extends Controller {
    user_resource /** @provide by UserProvider if set */
    customer /** @provide by CustomerProvider if set */
    order /** @provide by OrderProvider */
    userContext

    beforeEach() {
        this.userContext = this.user_resource || this.req.getUser()
    }

    async index() {
        this.can(UserPolicy.show, this.userContext)
        if (this.customer) this.req.query.set('customerId', this.customer.id)
        if (!this.req.getUser().hasRole(USER_ROLES.ADMIN))
            this.req.query.set('customerId', this.req.getUser().customer.id)
        const filters = this.validate(OrderValidator, OrderValidator.index())

        const search = new SearchRequest(this.req, ['customerId', 'id'])
        if (filters.status) {
            const sql = Sequelize.literal(
                '(SELECT "OrderStatuses"."orderId" FROM "OrderStatuses" WHERE  "OrderStatuses".status IN (:status) AND  "OrderStatuses"."createdAt" = (SELECT MAX(o."createdAt") FROM "OrderStatuses" as o WHERE "OrderStatuses"."orderId" = o."orderId"))',
            )
            search.addWhere({
                id: {
                    [Op.in]: sql,
                },
            })
            search.addReplacement('status', filters.status)
        }

        let model = Database.getInstance().models.Order

        if (filters.withProducts) {
            model = model.unscoped().scope('withProducts')
        }

        const orders = await model.findAll(search.query)

        const total = await model.count(search.queryWithoutPagination)

        this.res.json({
            data: orders,
            total,
        })
    }
    async show() {
        this.can(OrderPolicy.show, this.order)
        const refundsRequest = await this.order.getRefundRequestOrders()
        this.res.json({
            ...this.order.toJSON(),
            RefundRequestOrders: refundsRequest,
        })
    }
    async store() {
        const payload = this.validate(OrderValidator, OrderValidator.create())
        this.can(OrderPolicy.store, payload.customerId)

        let promo = null
        if (payload.promoId) {
            promo = await Database.getInstance().models.Promo.findOne({
                where: {
                    id: payload.promoId,
                },
            })
            NotFoundException.abortIf(!promo, 'Promo not found')
        }

        const billingAddress =
            await Database.getInstance().models.Address.findOne({
                where: {
                    id: payload.billingAddressId,
                    customerId: payload.customerId,
                },
            })
        NotFoundException.abortIf(!billingAddress, 'Billing address not found')

        const shippingAddress =
            await Database.getInstance().models.Address.findOne({
                where: {
                    id: payload.shippingAddressId,
                    customerId: payload.customerId,
                },
            })
        NotFoundException.abortIf(
            !shippingAddress,
            'Shipping address not found',
        )

        const orderPayload = {
            customerId: payload.customerId,
            shippingAddressId: payload.shippingAddressId,
            billingAddressId: payload.billingAddressId,
            promoId: payload.promoId,
        }

        const transaction = await Database.transaction()
        try {
            let order = await Database.getInstance().models.Order.create(
                orderPayload,
                {
                    transaction,
                },
            )

            const customer = await order.getCustomer()
            const basketItems =
                await UserBasketServices.getUserBasketSelfQuantity(
                    customer.userId,
                )

            // create the order details payload,
            // check if a user's basket exists and remove basket's quantity from the product stock
            const orderDetailsPayload = []
            for (const productPayload of payload.products) {
                const selfQuantity = basketItems.find(
                    (b) => b.productId == productPayload.productId,
                )?.quantity

                orderDetailsPayload.push(
                    await OrderDetailsServices.parseOrderLine(
                        order.id,
                        productPayload.productId,
                        productPayload.quantity,
                        selfQuantity || 0,
                    ),
                )
            }

            await Database.getInstance().models.OrderDetail.bulkCreate(
                orderDetailsPayload.filter(Boolean),
                { transaction },
            )
            await transaction.commit()
            order.OrderDetails = await order.getOrderDetails()

            await new OrderDenormalizationTask().execute(order)

            this.res.status(201).json(order)
        } catch (e) {
            console.error(e)
            await transaction.rollback()
            throw e
        }
    }
    async update() {
        this.can(OrderPolicy.update)
        const payload = this.validate(OrderValidator, OrderValidator.update())

        ForbiddenException.abortIf(
            this.order.status == OrderStatus.DELIVERED,
            'Cannot update a delivered order',
        )
        ForbiddenException.abortIf(
            this.order.status == OrderStatus.REFUNDED,
            'Cannot update a refunded order',
        )
        ForbiddenException.abortIf(
            this.order.status == OrderStatus.CANCELLED,
            'Cannot update a cancelled order',
        )

        let orderServices = new OrderServices(this.order)
        await orderServices.setStatus(payload.status)

        if (payload.status)
            await NotificationsServices.notifyOrderStatusUpdate(
                this.order,
                payload.status,
            )

        await this.res.sendStatus(200)
    }

    async pay() {
        this.can(OrderPolicy.show, this.order)
        let service = new OrderServices(this.order)
        let payment = await service.getLastPayment()
        if (payment)
            BadRequestException.abortIf(
                payment.status === PaymentStatus.SUCCEEDED,
                'Payment already done',
            )

        const session = await PaymentServices.createCheckoutSession(
            this.order,
            this.req.getUser(),
            this.req.body.get('discounts'),
        )
        this.res.json(session)
    }

    async askForRefund() {
        this.can(OrderPolicy.show, this.order)
        const payload = this.validate(AskForRefundValidator)
        BadRequestException.abortIf(
            this.order.status == OrderStatus.REFUNDED,
            'Cannot refund an order that is already refunded',
        )
        //@TODO : handle the choice of the items and the quantity to refund
        const refundRequest = await PaymentServices.askForRefund(
            this.order,
            payload.reason,
        )
        const customer = await this.order.getCustomer()
        await NotificationsServices.notifyNewRefundRequest(refundRequest)
        await NotificationsServices.notifyACKRefund(customer, refundRequest)
        this.res.sendStatus(201)
    }

    async getProducts() {
        this.can(OrderPolicy.show, this.order)

        //get the products of the order
        const orderDetails = await this.order.OrderDetails
        const products = await Promise.all(
            orderDetails.map(async (od) => {
                return {
                    ...od.toJSON(),
                    product:
                        await Database.getInstance().models.Product.findByPk(
                            od.productId,
                        ),
                }
            }),
        )

        return this.res.json({
            data: products,
            total: products.length,
        })
    }
}
