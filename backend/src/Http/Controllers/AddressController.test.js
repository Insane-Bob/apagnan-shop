import request from 'supertest'
import setUpApp from '../../app.js'
import { emptyTables, useFreshDatabase } from '../../tests/databaseUtils.js'
import { UserFactory } from '../../database/factories/UserFactory.js'
import { USER_ROLES } from '../../Models/SQL/user.js'
import { actingAs } from '../../tests/authTestUtils.js'
import { AddressFactory } from '../../database/factories/AddressFactory.js'
import { faker } from '@faker-js/faker'

let app = null
describe('AddressController test routes', () => {
    useFreshDatabase()
    beforeEach(async () => {
        app = await setUpApp()
    })

    test('GET /api/addresses or GET /api/users/:userId/address - index billing address (admin only)', async () => {
        await emptyTables()
        const admin = await UserFactory.withCustomer().create({
            role: USER_ROLES.ADMIN,
        })
        const ADDRESSES_ADMIN_COUNT = 4
        await AddressFactory.count(ADDRESSES_ADMIN_COUNT).create({
            customerId: admin.customer.id,
        })

        const user = await UserFactory.withCustomer().create()
        const ADDRESSES_USER_COUNT = 4
        await AddressFactory.count(ADDRESSES_USER_COUNT).create({
            customerId: user.customer.id,
        })

        actingAs(admin)
        let response = await request(app).get('/api/addresses')
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(
            ADDRESSES_ADMIN_COUNT + ADDRESSES_USER_COUNT,
        )
        response = await request(app).get(`/api/users/${user.id}/addresses`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(ADDRESSES_USER_COUNT)

        actingAs(user)
        response = await request(app).get('/api/addresses')
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(ADDRESSES_USER_COUNT)

        response = await request(app).get(`/api/users/${user.id}/addresses`)
        expect(response.statusCode).toBe(200)
        expect(response.body).toHaveLength(ADDRESSES_USER_COUNT)
    })

    test('GET /api/addresses/:address - show billing address', async () => {
        await emptyTables()

        const user1 = await UserFactory.withCustomer().create()
        const billingAddressUser1 = await AddressFactory.count(1).create({
            customerId: user1.customer.id,
        })

        const user2 = await UserFactory.withCustomer().create()
        const billingAddressUser2 = await AddressFactory.count(1).create({
            customerId: user2.customer.id,
        })

        actingAs(user1)
        let response = await request(app).get(
            `/api/addresses/${billingAddressUser1.id}`,
        )
        expect(response.statusCode).toBe(200)
        expect(response.body.id).toBe(billingAddressUser1.id)

        response = await request(app).get(
            `/api/addresses/${billingAddressUser2.id}`,
        )
        expect(response.statusCode).toBe(403)

        response = await request(app).get(`/api/addresses/13`)
        expect(response.statusCode).toBe(404)
    })

    test('POST /api/addresses - post billing address', async () => {
        await emptyTables()

        const user1 = await UserFactory.withCustomer().create()
        const user2 = await UserFactory.withCustomer().create()
        const billingAddressPayload = AddressFactory.instanciate()

        actingAs(user1)

        let response = await request(app)
            .post(`/api/addresses`)
            .send({
                ...billingAddressPayload,
                customerId: user1.customer.id,
            })
        expect(response.statusCode).toBe(201)

        response = await request(app)
            .post(`/api/addresses`)
            .send({
                ...billingAddressPayload,
                customerId: user2.customer.id,
            })

        expect(response.statusCode).toBe(403)

    })

    test('PUT /api/addresses/:address - update billing address', async () => {
        await emptyTables()

        const user1 = await UserFactory.withCustomer().create()
        const billingAddressUser1 = await AddressFactory.count(1).create({
            customerId: user1.customer.id,
        })

        const user2 = await UserFactory.withCustomer().create()
        const billingAddressUser2 = await AddressFactory.count(1).create({
            customerId: user2.customer.id,
        })

        actingAs(user1)

        let response = await request(app)
            .patch(`/api/addresses/${billingAddressUser1.id}`)
            .send({
                street: faker.location.street(),
            })
        expect(response.statusCode).toBe(200)

        response = await request(app)
            .patch(`/api/addresses/${billingAddressUser2.id}`)
            .send({
                street: faker.location.street(),
            })

        expect(response.statusCode).toBe(403)

        response = await request(app).patch(`/api/addresses/10`).send({
            street: faker.location.street(),
        })
        expect(response.statusCode).toBe(404)

    })

    test('DELETE /api/addresses/:address - delete billing address', async () => {
        await emptyTables()

        const user1 = await UserFactory.withCustomer().create()
        const billingAddressUser1 = await AddressFactory.count(1).create({
            customerId: user1.customer.id,
        })

        const user2 = await UserFactory.withCustomer().create()
        const billingAddressUser2 = await AddressFactory.count(1).create({
            customerId: user2.customer.id,
        })

        actingAs(user1)

        let response = await request(app).delete(
            `/api/addresses/${billingAddressUser1.id}`,
        )
        expect(response.statusCode).toBe(200)

        response = await request(app).delete(
            `/api/addresses/${billingAddressUser2.id}`,
        )
        expect(response.statusCode).toBe(403)

        response = await request(app).delete(`/api/addresses/10`)
        expect(response.statusCode).toBe(404)
    })
})
