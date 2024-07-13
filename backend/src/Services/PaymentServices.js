import Stripe from 'stripe'
import { Database } from '../Models/index.js'
import { OrderServices } from './OrderServices.js'
import { URLUtils } from '../utils/url.js'
import { PaymentStatus } from '../Models/payment.js'
import { AccessLinkServices } from './AccessLinkServices.js'
import { BadRequestException } from '../Exceptions/HTTPException.js'
import { OrderStatus } from '../Enums/OrderStatus.js'
const stripe = new Stripe(process.env.STRIPE_KEY)

/**
 * Payment services
 * Related to the payment process and stripe API
 */
export class PaymentServices {
    /**
     * create a stripe checkout session
     * @param {Order} order
     * @returns {Promise<void>}
     */
    static async createCheckoutSession(order, user) {
        const orderService = new OrderServices(order)
        const lineItems = await orderService.getStripeLineItems()
        const customer = await orderService.getCustomer()

        const accessLink = await AccessLinkServices.createAccessLink(
            user.id,
            AccessLinkServices.getDate(),
            AccessLinkServices.getDate(60),
            100, // Replace to 1
        )

        const session = await stripe.checkout.sessions.create({
            customer: customer.stripeId,
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${URLUtils.removeLastSlash(process.env.APP_URL)}/api/payments/success?orderId=${order.id}&a=${accessLink.identifier}`,
            cancel_url: `${URLUtils.removeLastSlash(process.env.APP_URL)}/api/payments/cancel?orderId=${order.id}&a=${accessLink.identifier}`,
        })

        await PaymentServices.createPayment(order, {
            sessionId: session.id,
            status: PaymentStatus.PENDING,
        })

        return session
    }

    /**
     * store a refund request
     * @param order
     * @param reason
     * @param amount
     * @returns {Promise<Model<any, TModelAttributes>>}
     */
    static async askForRefund(order, reason, amount = undefined) {
        const orderService = new OrderServices(order)

        const payment = await orderService.getLastSuccessPayment()
        BadRequestException.abortIf(!payment, 'No payment to refund')

        const refundRequest =
            await Database.getInstance().models.RefundRequestOrder.create({
                orderId: order.id,
                sessionId: payment.sessionId,
                reason: reason,
                approved: false,
                amount: amount || orderService.total,
            })

        return refundRequest
    }

    /**
     * approve a refund request and create a stripe refund
     * @param refundRequest
     * @returns {Promise<Stripe.Refund & {lastResponse: {headers: {[p: string]: string}, requestId: string, statusCode: number, apiVersion?: string, idempotencyKey?: string, stripeAccount?: string}}>}
     */
    static async createRefund(refundRequest) {
        BadRequestException.abortIf(refundRequest.approved, 'Already approved')

        const transaction = await Database.transaction()
        try {
            await refundRequest.update(
                {
                    approved: true,
                },
                { transaction },
            )

            const session = await PaymentServices.retrieveSession(
                refundRequest.sessionId,
            )
            BadRequestException.abortIf(
                !session.payment_intent,
                'No payment intent',
            )

            const refund = await stripe.refunds.create({
                payment_intent: session.payment_intent,
                amount: parseInt(refundRequest.amount),
            })

            await Database.getInstance().models.OrderRefund.create(
                {
                    refundId: refund.id,
                    requestRefundId: refundRequest.id,
                },
                {
                    transaction,
                },
            )

            await Database.getInstance().models.Order.update(
                {
                    status: OrderStatus.REFUNDED,
                },
                {
                    where: {
                        id: refundRequest.orderId,
                    },
                },
                {
                    transaction,
                },
            )
            await transaction.commit()
            return refund
        } catch (e) {
            console.error(e)
            await transaction.rollback()
            throw e
        }
    }

    /**
     * create a stripe customer and store it in the database
     * @param user
     * @returns {Promise<Customer>}
     */
    static async createCustomer(user, options) {
        const customerStripe = await stripe.customers.create({
            email: user.email,
        })
        return await Database.getInstance().models.Customer.create(
            {
                userId: user.id,
                stripeId: customerStripe.id,
            },
            options,
        )
    }

    /**
     * create a payment instance
     * @param order
     * @param payload
     * @returns {Promise<Payment>}
     */
    static async createPayment(order, payload) {
        return await Database.getInstance().models.Payment.create({
            ...payload,
            orderId: order.id,
        })
    }

    /**
     * retrieve a payment intent
     * @param paymentIntentId
     * @returns {Promise<Stripe.PaymentIntent & {lastResponse: {headers: {[p: string]: string}, requestId: string, statusCode: number, apiVersion?: string, idempotencyKey?: string, stripeAccount?: string}}>}
     */
    static async retrievePaymentIntent(paymentIntentId) {
        return await stripe.paymentIntents.retrieve(paymentIntentId)
    }

    static async retrieveSession(sessionId, options) {
        return await stripe.checkout.sessions.retrieve(sessionId, options)
    }

    /**
     * update the payment status in the database
     * @param paymentIntentId
     * @param status
     * @returns {Promise<any>}
     */
    static async updatePayment(sessionId, payload) {
        return await Database.getInstance().models.Payment.update(payload, {
            where: {
                sessionId,
            },
        })
    }
}
