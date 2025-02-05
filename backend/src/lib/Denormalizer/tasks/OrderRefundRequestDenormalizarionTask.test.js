/**
 * Ces tests permettent d'assurer la cohérence des données dénormalisées dans la collections Mongo
 * Mongo Collection : products
 */
import {
    useFreshDatabase,
    useFreshMongoDatabase,
} from '../../../tests/databaseUtils.js'
import { ProductFactory } from '../../../database/factories/ProductFactory.js'
import { DenormalizerQueue } from '../DenormalizerQueue.js'
import { OrderFactory } from '../../../database/factories/OrderFactory.js'
import { Database } from '../../../Models/index.js'
import { UserFactory } from '../../../database/factories/UserFactory.js'
import { OrderRefundRequestDenormalizationTask } from './OrderRefundRequestDenormalizationTask.js'
import { CustomerFactory } from '../../../database/factories/CustomerFactory.js'
import { AddressFactory } from '../../../database/factories/AddressFactory.js'
import { OrderStatus } from '../../../Enums/OrderStatus.js'
import { OrderServices } from '../../../Services/OrderServices.js'

let order
let products
let user
let refund
let Refunds

describe('OrderRefundRequestDenormalizarionTask', () => {
    const denormalizerQueue = DenormalizerQueue.getInstance()
    denormalizerQueue.enqueue = jest.fn((task) => task.execute())

    useFreshMongoDatabase()
    useFreshDatabase(async () => {
        Refunds = Database.getInstance().mongoModels.Refunds
        user = await UserFactory.withCustomer().create()
        let address = await AddressFactory.create({
            customerId: user.customer.id,
        })
        products = await ProductFactory.count(2).create()

        order = await OrderFactory.withDetails([
            { productId: products[0].id, quantity: 1 },
            { productId: products[1].id, quantity: 2 },
        ]).create({
            customerId: user.customer.id,
            billingAddressId: address.id,
            shippingAddressId: address.id,
        })

        await Database.getInstance().models.Payment.create({
            orderId: order.id,
            sessionId: 'session_id',
            paymentIntentId: 'payment_intent_id',
            status: 'succeeded',
        })
        refund = await Database.getInstance().models.RefundRequestOrder.create({
            sessionId: 'session_id',
            orderId: order.id,
            amount: 100,
            reason: 'reason',
            approved: false,
        })
    })

    test('Refund create', async () => {
        let mRefund = await Refunds.findOne({ id: refund.id })
        expect(mRefund).toBeTruthy()
    })

    test('Refund update', async () => {
        refund.approved = true
        const spy = jest.spyOn(
            OrderRefundRequestDenormalizationTask.prototype,
            'execute',
        )

        denormalizerQueue.enqueue = jest.fn((task) => task.execute())
        await refund.save()

        expect(denormalizerQueue.enqueue).toHaveBeenCalled()
        expect(spy).toHaveBeenLastCalledWith(refund)

        let mRefund = await Refunds.findOne({ id: refund.id, approved: true })
        expect(mRefund).toBeTruthy()

        spy.mockRestore()
    })

    test('Refund delete', async () => {
        const newRefund =
            await Database.getInstance().models.RefundRequestOrder.create({
                sessionId: 'session_id',
                orderId: order.id,
                amount: 100,
                reason: 'reason',
                approved: false,
            })

        let mNewRefund = await Refunds.findOne({ id: newRefund.id })
        expect(mNewRefund).toBeTruthy()

        let spy = jest.spyOn(
            OrderRefundRequestDenormalizationTask.prototype,
            'execute',
        )
        await newRefund.destroy()
        expect(spy).toHaveBeenCalled()

        mNewRefund = await Refunds.findOne({ id: newRefund.id })
        expect(mNewRefund).toBeFalsy()

        spy.mockRestore()
    })

    test('Order edit => check that not start task', async () => {
        const spy = jest.spyOn(
            OrderRefundRequestDenormalizationTask.prototype,
            'execute',
        )
        let orderService = new OrderServices(order)
        await orderService.setStatus(OrderStatus.SHIPPED)
        expect(spy).not.toHaveBeenCalled()
        spy.mockRestore()
    })

    test('Customer edit => check that not start task', async () => {
        const spy = jest.spyOn(
            OrderRefundRequestDenormalizationTask.prototype,
            'execute',
        )
        await Database.getInstance().models.Customer.update(
            {
                stripeID: CustomerFactory.instanciate().stripeID,
            },
            { where: { id: user.customer.id } },
        )
        expect(spy).not.toHaveBeenCalled()
        spy.mockRestore()
    })

    test('User edit', async () => {
        const spy = jest.spyOn(
            OrderRefundRequestDenormalizationTask.prototype,
            'execute',
        )
        user.email = UserFactory.instanciate().email
        await user.save()

        expect(spy).toHaveBeenCalledWith(user)

        let mRefund = await Refunds.findOne({ id: refund.id })
        expect(mRefund.Order.Customer.User.email).toBe(user.email)
        spy.mockRestore()
    })
})
