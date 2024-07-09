import crypto from 'crypto'
import request from 'supertest'
import setUpApp from '../../app.js'
import { Database } from '../../Models/index.js'
import { actingAs } from '../../tests/authTestUtils.js'
import { useFreshDatabase } from '../../tests/databaseUtils.js'
import { UserFactory } from '../../database/factories/UserFactory.js'
import { ProductFactory } from '../../database/factories/ProductFactory.js'

let app = null
describe('UserBasketController test routes', () => {
    let user1 = null
    let user2 = null
    let product = null

    async function testRequest(
        route,
        method,
        expectCode,
        customRequest = (request) => request,
        customExpect = (response) => response,
    ) {
        const req = request(app)
            [method](route)
            .set('Accept', 'application/json')
        const response = await customRequest(req)
        expect(response.statusCode).toBe(expectCode)
        customExpect(response)
        return
    }

    useFreshDatabase(async () => {
        user1 = await UserFactory.withCustomer().create({
            password: 'password',
        })

        user2 = await UserFactory.withCustomer().create({
            password: 'password',
        })

        product = await ProductFactory.withStock(100).create({
            published: true,
        })

    })
    beforeEach(async () => {
        app = await setUpApp()
    })

    test('PUT /api/users/:userId/basket/:productId - add product 1 in the user basket', async () => {
        actingAs(user1)
        await testRequest(
            `/api/users/${user1.id}/basket/${product.id}`,
            'put',
            200,
            (request) => request.send({ quantity: 2 }),
        )
    })

    test('PUT /api/users/:userId/basket/:productId - add product 1 in the user basket but no stock', async () => {
        actingAs(user1)
        await testRequest(
          `/api/users/${user1.id}/basket/${product.id}`,
          'put',
          403,
          (request) => request.send({ quantity: 200 }),
        )
    })

    test('DELETE /api/users/:userId/basket/:productId - remove basket 1 in the user basket', async () => {
        actingAs(user1)
        await testRequest(`/api/users/${user1.id}/basket/${product.id}`, 'delete', 200)
    })

    test('PUT /api/users/:userId/basket/:productId - add product 1 in the user basket - not Authorized', async () => {
        actingAs(user2)
        await testRequest(
            `/api/users/${user1.id}/basket/${product.id}`,
            'put',
            403,
            (request) => request.send({ quantity: 2 }),
        )
    })

    test('DELETE /api/users/:userId/basket/:productId - remove basket 1 in the user basket - not Authorized', async () => {
        actingAs(user2)
        await testRequest(`/api/users/${user1.id}/basket/${product.id}`, 'put', 403)
    })
})
