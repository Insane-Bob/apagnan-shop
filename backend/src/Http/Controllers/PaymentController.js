import { Controller } from '../../Core/Controller.js'
import { BadRequestException } from '../../Exceptions/HTTPException.js'
import { OrderServices } from '../../Services/OrderServices.js'
import { PaymentStatus } from '../../Models/SQL/payment.js'
import { PaymentServices } from '../../Services/PaymentServices.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'
import { Database } from '../../Models/index.js'
import { UserBasketServices } from '../../Services/UserBasketServices.js'
import { StockService } from '../../Services/StockService.js'

export class PaymentController extends Controller {
    /** @type {Order} */
    order
    /** @type {OrderServices} */
    orderService
    async beforeEach() {
        const orderId = this.req.query.get('orderId', null)
        BadRequestException.abortIf(!orderId, 'Invalid order id')

        this.order = await OrderServices.retrieveOrderById(orderId)
        BadRequestException.abortIf(!this.order, 'Invalid order id')

        this.orderService = new OrderServices(this.order)
    }

    async success() {
        this.can()
        const payment = await this.orderService.getLastPayment()
        if (!payment) return this.cancel()

        const session = await PaymentServices.retrieveSession(
            payment.sessionId,
            {
                expand: ['payment_intent'],
            },
        )

        const validSuccessStatus = ['processing', 'succeeded']
        const stripePayment = session.payment_intent

        if (
            !stripePayment ||
            !validSuccessStatus.includes(stripePayment.status)
        )
            return this.cancel()

        if (payment.status === PaymentStatus.SUCCEEDED)
            return this.res.json({
                message: 'Payment already succeeded',
            })

        await PaymentServices.updatePayment(session.id, {
            status: PaymentStatus.SUCCEEDED,
            paymentIntentId: session.payment_intent.id,
        })

        //@TODO : send to the transport supplier

        let orderDetails = this.order.OrderDetails.map((orderDetail) => ({
            productId: orderDetail.productId,
            quantity: orderDetail.quantity,
        }))

        const transaction = await Database.transaction()
        try {
            for (let orderDetail of orderDetails) {
                await UserBasketServices.removeProductFromBasket(
                    this.order.Customer.userId,
                    orderDetail.productId,
                    {
                        transaction,
                    },
                )

                await StockService.removeStock(
                    orderDetail.productId,
                    orderDetail.quantity,
                    transaction,
                )

                await NotificationsServices.notifySuccessPaymentCustomer(
                    this.order.Customer.User,
                    this.order,
                )

                await transaction.commit()

                this.res.redirect(process.env.FRONT_END_URL + '/order/success')
            }
        } catch (e) {
            console.error(e)
            await transaction.rollback()
            throw e
        }
    }

    async cancel() {
        this.can()
        const payment = await this.orderService.getLastPayment()
        BadRequestException.abortIf(!payment, 'Invalid payment')

        const session = await PaymentServices.retrieveSession(payment.sessionId)
        await PaymentServices.updatePayment(session.id, {
            status: PaymentStatus.FAILED,
            paymentIntentId: session.payment_intent,
        })

        await NotificationsServices.notifyFailedPaymentCustomer(
            this.order.Customer.User,
        )

        this.res.json({
            message: 'Payment failed',
        }) //@TODO : Return a redirect to the cancel page
    }
}
