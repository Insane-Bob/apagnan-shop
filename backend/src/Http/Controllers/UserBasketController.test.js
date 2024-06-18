import crypto from 'crypto'
import request from 'supertest'
import setUpApp from '../../app.js'
import { Database } from '../../Models/index.js'
import { actingAs } from '../../tests/authTestUtils.js'
import { useFreshDatabase } from '../../tests/databaseUtils.js'

let app = null
describe('UserBasketController test routes', () => {
    let user1 = null
    let user2 = null

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
        console.log(response.body)
        expect(response.statusCode).toBe(expectCode)
        customExpect(response)
        return
    }

    useFreshDatabase(async () => {
        user1 = await Database.getInstance().models.User.create({
            firstName: 'Test',
            lastName: 'User',
            email: crypto.randomBytes(20).toString('hex') + '@test.com',
            password: 'password',
        })
        await Database.getInstance().models.Customer.create({
            userId: user1.id,
            stripeId: 'cus_' + crypto.randomBytes(15).toString('hex'),
        })

        user2 = await Database.getInstance().models.User.create({
            firstName: 'Test',
            lastName: 'User',
            email: crypto.randomBytes(20).toString('hex') + '@test.com',
            password: 'password',
        })

        await Database.getInstance().models.Customer.create({
            userId: user2.id,
            stripeId: 'cus_' + crypto.randomBytes(15).toString('hex'),
        })
    })
    beforeEach(async () => {
        app = await setUpApp()
    })

    test('POST /api/users/:userId/basket/add/:productId - add product 1 in the user basket', async () => {
        actingAs(user1)
        await testRequest(
            `/api/users/${user1.id}/basket/add/1`,
            'post',
            200,
            (request) => request.send({ quantity: 2 }),
        )
    })

    test('POST /api/users/:userId/basket/remove/:productId - remove basket 1 in the user basket', async () => {
        actingAs(user1)
        await testRequest(`/api/users/${user1.id}/basket/remove/1`, 'post', 200)
    })

    test('POST /api/users/:userId/basket/add/:productId - add product 1 in the user basket - not Authorized', async () => {
        actingAs(user2)
        await testRequest(
            `/api/users/${user1.id}/basket/add/1`,
            'post',
            403,
            (request) => request.send({ quantity: 2 }),
        )
    })

    test('POST /api/users/:userId/basket/remove/:productId - remove basket 1 in the user basket - not Authorized', async () => {
        actingAs(user2)
        await testRequest(`/api/users/${user1.id}/basket/remove/1`, 'post', 403)
    })
})
