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
    ForbiddenException,
    NotFoundException,
} from '../../Exceptions/HTTPException.js'
import { USER_ROLES } from '../../Models/user.js'
import { OrderDetailsServices } from '../../Services/OrderDetailsServices.js'
import { OrderStatus } from '../../Enums/OrderStatus.js'
import { UserBasketServices } from '../../Services/UserBasketServices.js'

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

        const search = new SearchRequest(this.req, ['customerId'])
        const orders = await Database.getInstance().models.Order.findAll(
            search.query,
        )
        this.res.json(orders)
    }
    show() {
        this.can(OrderPolicy.show, this.order)
        this.res.json(this.order)
    }
    async store() {
        const payload = this.validate(OrderValidator, OrderValidator.create())
        this.can(OrderPolicy.store, payload.customerId)

        const address = await Database.getInstance().models.Address.findOne({
            where: {
                id: payload.addressId,
                customerId: payload.customerId,
            },
        })
        NotFoundException.abortIf(!address, 'Billing address not found')

        const orderPayload = {
            customerId: payload.customerId,
            addressId: payload.addressId,
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

            this.res.status(201).json(order)
        } catch (e) {
            console.log(e)
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

        const rowsEdited = await this.order.update(payload)
        NotFoundException.abortIf(!rowsEdited)

        if (payload.status)
            await NotificationsServices.notifyOrderStatusUpdate(
                this.order,
                payload.status,
            )

        await this.res.sendStatus(200)
    }

    async pay() {
        this.can(OrderPolicy.show, this.order)
        const session = await PaymentServices.createCheckoutSession(this.order)
        this.res.json(session)
    }

    async askForRefund() {
        this.can(OrderPolicy.show, this.order)
        const payload = this.validate(AskForRefundValidator)
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
}
