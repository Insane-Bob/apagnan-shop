import {
    useFreshDatabase,
    useFreshMongoDatabase,
} from '../../tests/databaseUtils.js'
import crypto from 'crypto'
import { DenormalizerQueue } from '../../lib/Denormalizer/DenormalizerQueue.js'
import { UserFactory } from '../../database/factories/UserFactory.js'
import { ProductFactory } from '../../database/factories/ProductFactory.js'
import { OrderFactory } from '../../database/factories/OrderFactory.js'
import { SearchController } from './SearchController.js'
import { Database } from '../../Models/index.js'
import { OrderDenormalizationTask } from '../../lib/Denormalizer/tasks/OrderDenormalizationTask.js'
import setUpApp from '../../app.js'
import request from 'supertest'
import { actingAs } from '../../tests/authTestUtils.js'
import { USER_ROLES } from '../../Models/SQL/user.js'
import { AddressFactory } from '../../database/factories/AddressFactory.js'

let users
let products
describe('SearchController test', () => {
    const denormalizerQueue = DenormalizerQueue.getInstance()
    denormalizerQueue.enqueue = jest.fn((task) => task.execute())

    useFreshMongoDatabase()
    useFreshDatabase(async () => {
        // Database seeding
        users = await UserFactory.count(10).withCustomer().create()
        products = await ProductFactory.count(10).create()

        for (let user of users) {
            const hasOrder = Math.random() > 0.5
            if (!hasOrder) continue
            user.address = await AddressFactory.count(1).create({
                customerId: user.id,
            })
            const orderCount = Math.floor(Math.random() * 5)
            for (let i = 0; i < orderCount; i++) {
                user.order = await OrderFactory.withDetails([
                    {
                        productId:
                            products[
                                Math.floor(Math.random() * products.length)
                            ].id,
                        quantity: Math.floor(Math.random() * 2),
                    },
                    {
                        productId:
                            products[
                                Math.floor(Math.random() * products.length)
                            ].id,
                        quantity: Math.floor(Math.random() * 2),
                    },
                    {
                        productId:
                            products[
                                Math.floor(Math.random() * products.length)
                            ].id,
                        quantity: Math.floor(Math.random() * 2),
                    },
                ]).create({
                    customerId: user.id,
                    billingAddressId: user.address.id,
                    shippingAddressId: user.address.id,
                })
                await new OrderDenormalizationTask().execute(user.order)
            }
        }
    })

    test('it should return an empty list', async () => {
        const controller = new SearchController()
        let emptyList = await controller.makeQuery(
            Database.getInstance().mongoModels.Products,
            crypto.randomBytes(20).toString('hex'),
        )
        expect(emptyList.length).toBe(0)

        emptyList = await controller.makeQuery(
            Database.getInstance().mongoModels.Orders,
            crypto.randomBytes(20).toString('hex'),
        )
        expect(emptyList.length).toBe(0)

        emptyList = await controller.makeQuery(
            Database.getInstance().mongoModels.Users,
            crypto.randomBytes(20).toString('hex'),
        )
        expect(emptyList.length).toBe(0)
    })

    test('it should return a list of products', async () => {
        const controller = new SearchController()
        let randomProductIndex = Math.floor(Math.random() * products.length)
        let searchString =
            products[randomProductIndex][
                Math.random() > 0.5 ? 'name' : 'description'
            ]
        const mProducts = await controller.makeQuery(
            Database.getInstance().mongoModels.Products,
            searchString,
        )
        expect(mProducts.length).toBeGreaterThan(0)
    })

    test('it should return a list of orders', async () => {
        const controller = new SearchController()
        let usersWithOrders = users.filter((u) => Boolean(u?.order))
        let randomUserIndex = Math.floor(Math.random() * usersWithOrders.length)
        const searchString = usersWithOrders[randomUserIndex].firstName
        const orders = await controller.makeQuery(
            Database.getInstance().mongoModels.Orders,
            searchString,
        )
        expect(orders.length).toBeGreaterThan(0)
    })

    test('it should return a list of users', async () => {
        const controller = new SearchController()
        let randomUserIndex = Math.floor(Math.random() * users.length)
        const searchString = users[randomUserIndex].firstName
        const mbUsers = await controller.makeQuery(
            Database.getInstance().mongoModels.Users,
            searchString,
        )
        expect(mbUsers.length).toBeGreaterThan(0)
    })

    test('Route GET /api/search => not auth', async () => {
        let app = await setUpApp()
        let response = await request(app).get('/api/search')
        expect(response.statusCode).toBe(401)
    })

    test('Route GET /api/search => auth', async () => {
        let app = await setUpApp()
        let user = users[Math.floor(Math.random() * users.length)]
        actingAs(user)
        let response = await request(app).get('/api/search')
        expect(response.statusCode).toBe(403)

        user.role = USER_ROLES.ADMIN
        actingAs(user)
        response = await request(app).get('/api/search')
        expect(response.statusCode).toBe(422)

        response = await request(app).get('/api/search?s=+')
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBe(0)

        response = await request(app).get('/api/search?s=' + products[0].name)
        expect(response.statusCode).toBe(200)
        expect(response.body.length).toBeGreaterThanOrEqual(1)
    })
})
