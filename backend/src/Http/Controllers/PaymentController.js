import { Controller } from '../../Core/Controller.js'
import { BadRequestException } from '../../Exceptions/HTTPException.js'
import { OrderServices } from '../../Services/OrderServices.js'
import { PaymentStatus } from '../../Models/payment.js'
import { PaymentServices } from '../../Services/PaymentServices.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'

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

        await PaymentServices.updatePayment(session.id, {
            status: PaymentStatus.SUCCEEDED,
            paymentIntentId: session.payment_intent.id,
        })

        //@TODO : send to the transport supplier

        //@TODO : remove products from stock

        await NotificationsServices.notifySuccessPaymentCustomer(this.order)

        this.res.json(session) //@TODO : Return a redirect to the success page
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

        await NotificationsServices.notifyFailedPaymentCustomer(this.order)

        this.res.json(session) //@TODO : Return a redirect to the cancel page
    }
}
