import request from 'supertest'
import setUpApp from '../../app.js'
import { actingAs } from '../../tests/authTestUtils.js'
import { useFreshDatabase } from '../../tests/databaseUtils.js'
import { UserFactory } from '../../database/factories/UserFactory.js'
import { Database } from '../../Models/index.js'

let app = null
describe('UserWidgetController test routes', () => {
    useFreshDatabase()
    beforeEach(async ()=>{
        app = await setUpApp()
    })

    test('GET /api/users/:userId/widget - get the user widget display', async () => {
        const user1 = await UserFactory.withWidget().withCustomer().create()
        const user2 = await UserFactory.withWidget().withCustomer().create()

        actingAs(user1)
        let response = await request(app).get(`/api/users/${user1.id}/widget`)
        expect(response.statusCode).toBe(200)

        response = await request(app).get(`/api/users/${user2.id}/widget`)
        expect(response.statusCode).toBe(403)
    })

    test('PUT /api/users/:userId/widget - update the user widget display', async () => {
        const user1 = await UserFactory.withWidget().withCustomer().create()
        const user2 = await UserFactory.withWidget().withCustomer().create()

        const payload = {
            data:[{
                name: 'test',
                styles: {
                    grid: 'test'
                }
            }]
        }

        actingAs(user1)
        let response = await request(app).put(`/api/users/${user1.id}/widget`).send(payload)
        expect(response.statusCode).toBe(200)

        const widget = await Database.getInstance().models.UserWidget.findOne({where:{userId:user1.id}})
        expect(widget).not.toBeNull()
        expect(widget.data).toEqual(JSON.stringify(payload.data))

        response = await request(app).put(`/api/users/${user2.id}/widget`).send(payload)
        expect(response.statusCode).toBe(403)

        const invalidPayload = {
            data:{
                name: 'test',
                styles: {
                    grid: 'test'
                }
            }
        }

        response = await request(app).put(`/api/users/${user1.id}/widget`).send(invalidPayload)
        expect(response.statusCode).toBe(422)
    })
})
