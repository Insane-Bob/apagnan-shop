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
import { CustomerFactory } from '../../../database/factories/CustomerFactory.js'
import { OrderDenormalizationTask } from './OrderDenormalizationTask.js'
import { OrderStatus } from '../../../Enums/OrderStatus.js'
import { AddressFactory } from '../../../database/factories/AddressFactory.js'
import { OrderServices } from '../../../Services/OrderServices.js'

let order
let user
let products
let Orders
describe('OrderDenormalizationTask', () => {
    const denormalizerQueue = DenormalizerQueue.getInstance()
    denormalizerQueue.enqueue = jest.fn((task) => task.execute())

    useFreshMongoDatabase()
    useFreshDatabase(async () => {
        Orders = Database.getInstance().mongoModels.Orders

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
    })

    test('Order create not start task automatically', async () => {
        let mOrder = await Orders.findOne({ id: order.id })
        expect(mOrder).toBeFalsy()

        await new OrderDenormalizationTask().execute(order) // start task manually (like in the controller)
        mOrder = await Orders.findOne({ id: order.id })
        expect(mOrder).toBeTruthy()

        const details = await Database.getInstance().models.OrderDetail.findAll(
            {
                where: {
                    orderId: order.id,
                },
            },
        )

        expect(mOrder.OrderDetails.length).toBe(details.length)
    })

    test('OrderStatus update #1', async () => {
        let spy = jest.spyOn(OrderDenormalizationTask.prototype, 'execute')

        let orderService = new OrderServices(order)
        await orderService.setStatus(OrderStatus.DELIVERED)
        expect(spy).toHaveBeenCalledWith(order)

        let mOrder = await Orders.findOne({
            id: order.id,
            status: OrderStatus.DELIVERED,
        })

        expect(mOrder).toBeTruthy()
        spy.mockRestore()
    })

    test('Order update #2 check that the OrderDetail never change', async () => {
        let beforeMOrder = await Orders.findOne({ id: order.id })
        expect(beforeMOrder.OrderDetails).toBeTruthy()
        expect(beforeMOrder.OrderDetails.length).toBe(2)

        let spy = jest.spyOn(OrderDenormalizationTask.prototype, 'execute')
        await Database.getInstance().models.OrderDetail.create({
            orderId: order.id,
            productId: products[1].id,
            quantity: 3,
            unitPrice: 1000,
        })
        let orderServices = new OrderServices(order)
        await orderServices.setStatus(OrderStatus.REFUNDED)
        expect(spy).toHaveBeenCalledWith(order)

        let mOrder = await Orders.findOne({
            id: order.id,
            status: OrderStatus.REFUNDED,
        })
        expect(mOrder).toBeTruthy()
        expect(mOrder.OrderDetails.length).toBe(2)
        spy.mockRestore()
    })

    test('Customer edit check that not start task', async () => {
        const spy = jest.spyOn(OrderDenormalizationTask.prototype, 'execute')
        await Database.getInstance().models.Customer.update(
            {
                stripeID: CustomerFactory.instanciate().stripeID,
            },
            { where: { id: user.customer.id } },
        )
        expect(spy).not.toHaveBeenCalled()
        spy.mockRestore()
    })

    test('Order details update (never happens) check that not start task', async () => {
        const spy = jest.spyOn(OrderDenormalizationTask.prototype, 'execute')
        await Database.getInstance().models.OrderDetail.update(
            {
                unitPrice: 1000,
            },
            { where: { orderId: order.id } },
        )
        expect(spy).not.toHaveBeenCalled()
        spy.mockRestore()
    })
})
