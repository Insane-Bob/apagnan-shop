import request from 'supertest'
import setUpApp from '../../app.js'
import { useFreshDatabase } from '../../tests/databaseUtils.js'
import { UserFactory } from '../../database/factories/UserFactory.js'
import { OrderFactory } from '../../database/factories/OrderFactory.js'
import { AddressFactory } from '../../database/factories/AddressFactory.js'
import { ProductFactory } from '../../database/factories/ProductFactory.js'
import payment, { PaymentStatus } from '../../Models/SQL/payment.js'
import crypto from 'crypto'
import { actingAs } from '../../tests/authTestUtils.js'
import { PaymentController } from './PaymentController.js'
import { StockService } from '../../Services/StockService.js'
import { Database } from '../../Models/index.js'
import { PaymentServices } from '../../Services/PaymentServices.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'

let app = null
let user
let order

let PaymentControllerPaymentSucceededSpy
describe('PaymentController test routes', () => {
    useFreshDatabase()
    beforeEach(async () => {
        PaymentControllerPaymentSucceededSpy = jest.spyOn(
            PaymentController.prototype,
            'onPaymentSucceeded',
        )
        app = await setUpApp()
        user = await UserFactory.count(1).withCustomer().create()
        let address = await AddressFactory.create({
            customerId: user.customer.id,
        })
        let product = await ProductFactory.create()
        order = await OrderFactory.withDetails([
            {
                productId: product.id,
                quantity: 1,
            },
        ])
            .count(1)
            .create({
                customerId: user.customer.id,
                billingAddressId: address.id,
                shippingAddressId: address.id,
            })
    })

    function createPayment() {
        return Database.getInstance().models.Payment.create({
            orderId: order.id,
            status: PaymentStatus.PENDING,
            sessionId: crypto.randomBytes(16).toString('hex'),
        })
    }

    test('GET /api/payments/success - without payment => 400', async () => {
        let spy = jest.spyOn(PaymentController.prototype, 'cancel')
        actingAs(user)
        let response = await request(app).get(
            '/api/payments/success?orderId=' + order.id,
        )
        expect(spy).toHaveBeenCalled()
        expect(response.statusCode).toBe(400)
    })

    test('GET /api/payments/success - with payment => 302', async () => {
        let spy = jest.spyOn(StockService, 'removeStock')
        actingAs(user)
        await createPayment()
        let response = await request(app).get(
            '/api/payments/success?orderId=' + order.id,
        )
        expect(spy).toHaveBeenCalled()
        expect(response.statusCode).toBe(302)
    })

    test('GET /api/payments/cancel - with payment', async () => {
        let payment = await createPayment()
        PaymentServices.retrieveSession = jest.fn().mockResolvedValue({
            id: payment.sessionId,
            payment_intent: 'pi_123',
        })
        let spy = jest.spyOn(
            NotificationsServices,
            'notifyFailedPaymentCustomer',
        )
        actingAs(user)
        await request(app).get('/api/payments/cancel?orderId=' + order.id)

        let updatedPayment =
            await Database.getInstance().models.Payment.findByPk(
                payment.sessionId,
            )

        expect(updatedPayment.status).toBe(PaymentStatus.FAILED)
        expect(spy).toHaveBeenCalled()
    })

    function makeWebhookRequest(object, type = 'checkout.session.completed') {
        return request(app)
            .post('/api/payments/webhook')
            .send({
                type,
                object: 'event',
                data: {
                    object,
                },
            })
    }

    test('POST /api/payments/webhook - signature enabled => 400', async () => {
        let paymentIntent = {
            id: 'pi_123',
        }
        let response = await makeWebhookRequest(paymentIntent)
        expect(response.statusCode).toBe(400)
    })

    test('POST /api/payments/webhook - checkout.session.completed || checkout.session.async_payment_succeeded', async () => {
        const payment = await createPayment()
        let checkoutSession = {
            id: payment.sessionId,
            payment_intent: 'pi_123',
        }
        PaymentServices.constructEvent = jest.fn((body) => {
            return JSON.parse(body.toString())
        })
        PaymentServices.retrieveCheckoutSessionFromPaymentIntentID = jest
            .fn()
            .mockResolvedValue({
                data: [
                    {
                        id: payment.sessionId,
                    },
                ],
            })

        actingAs(user)
        let event = Math.random() > 0.5 ? 'checkout.session.completed' : 'checkout.session.async_payment_succeeded'
        await makeWebhookRequest(checkoutSession, event)


        expect(PaymentControllerPaymentSucceededSpy).toHaveBeenCalledWith(
            checkoutSession,
        )

        let updatedPayment =
            await Database.getInstance().models.Payment.findByPk(
                payment.sessionId,
            )

        expect(updatedPayment.status).toBe(PaymentStatus.SUCCEEDED)

        PaymentServices.retrieveCheckoutSessionFromPaymentIntentID = jest
            .fn()
            .mockResolvedValue({
                data: [],
            })

        let response = await makeWebhookRequest(checkoutSession, event)
        expect(response.statusCode).toBe(404)
    })
})
