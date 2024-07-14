import { Controller } from '../../Core/Controller.js'
import {
    BadRequestException,
    HTTPException,
    NotFoundException,
} from '../../Exceptions/HTTPException.js'
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
    async fetchOrder() {
        const orderId = this.req.query.get('orderId', null)
        BadRequestException.abortIf(!orderId, 'Invalid order id')

        this.order = await OrderServices.retrieveOrderById(orderId)
        BadRequestException.abortIf(!this.order, 'Invalid order id')

        this.orderService = new OrderServices(this.order)
    }

    /**
     * Sur le success on ne fait que retirer les produits du panier et mettre à jour le stock
     * @returns {Promise<void>}
     */
    async success() {
        this.can()
        await this.fetchOrder()
        const payment = await this.orderService.getLastPayment()
        if (!payment) return this.cancel()

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

                await transaction.commit()

                this.res.redirect(process.env.FRONT_END_URL + '/order/success')
            }
        } catch (e) {
            console.error(e)
            await transaction.rollback()
            throw e
        }
    }

    /**
     * Si l'utilisateur annule la checkout session on annule le paiement mais on ne touche pas au panier
     * @returns {Promise<void>}
     */
    async cancel() {
        this.can()
        await this.fetchOrder()
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
        })
    }

    async webhook() {
        const sig = this.req.headers.get('stripe-signature')
        try {
            let payload = PaymentServices.constructEvent(
                this.req._req.body,
                sig,
            )

            if (payload.object != 'event')
                return this.res.status(422).json({ message: 'Invalid payload' })
            const type = payload.type
            const object = payload.data.object

            if (type === 'payment_intent.succeeded') {
                await this.onPaymentSucceeded(object)
            }

            if (type === 'payment_intent.payment_failed') {
                await this.onPaymentFailed(object)
            }

            this.res.json({ received: true })
        } catch (err) {
            if (err instanceof HTTPException) throw err
            BadRequestException.abort(err.message)
        }
    }

    async webhookFetch(paymentIntent) {
        const checkoutSessions =
            await PaymentServices.retrieveCheckoutSessionFromPaymentIntentID(
                paymentIntent.id,
            )
        NotFoundException.abortIf(
            checkoutSessions.data.length !== 1,
            'Session not found',
        )
        const checkoutSession = checkoutSessions.data[0]

        const payment = await Database.getInstance().models.Payment.findOne({
            where: {
                sessionId: checkoutSession.id,
            },
            include: [
                {
                    model: Database.getInstance().models.Order,
                    include: [
                        {
                            model: Database.getInstance().models.Customer,
                            include: [
                                {
                                    model: Database.getInstance().models.User,
                                },
                            ],
                        },
                    ],
                },
            ],
        })

        NotFoundException.abortIf(!payment, 'Payment not found')

        return {
            checkoutSession,
            payment,
        }
    }

    async onPaymentSucceeded(paymentIntent) {
        if (!paymentIntent) return

        const { payment, checkoutSession } =
            await this.webhookFetch(paymentIntent)

        if (!payment) return
        if (payment.status === PaymentStatus.SUCCEEDED) return

        await PaymentServices.updatePayment(checkoutSession.id, {
            paymentIntentId: paymentIntent.id,
            status: PaymentStatus.SUCCEEDED,
        })

        await NotificationsServices.notifySuccessPaymentCustomer(
            payment.Order.Customer.User,
            payment.Order,
        )
        //@TODO : send to the transport supplier
    }

    async onPaymentFailed(paymentIntent) {
        if (!paymentIntent) return

        const { payment, checkoutSession } =
            await this.webhookFetch(paymentIntent)

        if (!payment) return
        if (payment.status === PaymentStatus.FAILED) return

        await PaymentServices.updatePayment(checkoutSession.id, {
            paymentIntentId: paymentIntent.id,
            status: PaymentStatus.FAILED,
        })

        await NotificationsServices.notifyFailedPaymentCustomer(
            payment.Order.Customer.User,
            payment.Order,
        )
    }
}
