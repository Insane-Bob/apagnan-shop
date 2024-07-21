import Stripe from 'stripe'
import { Database } from '../Models/index.js'
import { OrderServices } from './OrderServices.js'
import { URLUtils } from '../utils/url.js'
import { AccessLinkServices } from './AccessLinkServices.js'
import { PaymentStatus } from '../Models/SQL/payment.js'
import { BadRequestException } from '../Exceptions/HTTPException.js'
import { OrderStatus } from '../Enums/OrderStatus.js'
import ISOCountry from 'i18n-iso-countries'
const stripe = new Stripe(process.env.STRIPE_KEY)

/**
 * Payment services
 * Related to the payment process and stripe API
 */
export class PaymentServices {
    static async upsertBillingAddress(customerStripeId, billingAddress) {
        let country = billingAddress.country
        let countryCode = ISOCountry.getAlpha2Code(country, 'en')

        const customer = await stripe.customers.update(customerStripeId, {
            address: {
                city: billingAddress.city,
                country: countryCode,
                line1: billingAddress.street,
                postal_code: billingAddress.postalCode,
                state: billingAddress.region,
            },
        })
        return customer
    }
    /**
     * create a stripe checkout session
     * @param {Order} order
     * @returns {Promise<void>}
     */
    static async createCheckoutSession(order, user) {
        const orderService = new OrderServices(order)
        const lineItems = await orderService.getStripeLineItems()
        const customer = await orderService.getCustomer()

        const billingAddress = await order.getBilling_address()
        await PaymentServices.upsertBillingAddress(
            customer.stripeId,
            billingAddress,
        )

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
            currency: 'eur',
            discounts: discounts,

            mode: 'payment',
            currency: 'eur',
            automatic_tax: {
                enabled: true,
            },
            invoice_creation: {
                enabled: true,
            },
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

        const refundRequestExists =
            await Database.getInstance().models.RefundRequestOrder.findOne({
                where: {
                    sessionId: payment.sessionId,
                },
            })
        BadRequestException.abortIf(
            refundRequestExists,
            'Already asked for refund',
        )

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
                { expand: ['payment_intent'] },
            )
            BadRequestException.abortIf(
                !session.payment_intent,
                'No payment intent',
            )

            const refund = await stripe.refunds.create({
                payment_intent: session.payment_intent.id,
                amount: parseInt(refundRequest.amount) * 100,
            })

            const creditNote = await stripe.creditNotes.create({
                refund: refund.id,
                invoice: session.payment_intent.invoice,
                amount: parseInt(refundRequest.amount) * 100,
                reason: 'product_unsatisfactory',
                memo: refundRequest.reason,
            })

            await Database.getInstance().models.OrderRefund.create(
                {
                    refundId: refund.id,
                    requestRefundId: refundRequest.id,
                    creditNoteId: creditNote.id,
                },
                {
                    transaction,
                },
            )

            let order = await refundRequest.getOrder()
            let orderService = new OrderServices(order)
            await orderService.setStatus(OrderStatus.REFUNDED, { transaction })

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

    static retrieveCheckoutSessionFromPaymentIntentID(paymentIntentId) {
        return stripe.checkout.sessions.list({
            payment_intent: paymentIntentId,
        })
    }

    static retrieveInvoice(invoiceId) {
        return stripe.invoices.retrieve(invoiceId)
    }

    static retrieveCreditNote(creditNoteId) {
        return stripe.creditNotes.retrieve(creditNoteId)
    }

    static constructEvent(...args) {
        args.push(process.env.STRIPE_WEBHOOK_SECRET)
        return stripe.webhooks.constructEvent(...args)
    }
}
