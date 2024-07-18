import request from 'supertest'
import setUpApp from '../../app.js'
import { Database } from '../../Models/index.js'
import { useFreshDatabase } from '../../tests/databaseUtils.js'
import { UserFactory } from '../../database/factories/UserFactory.js'

let app = null
describe('NewsletterController test routes', () => {
    let email = UserFactory.instanciate().email
    useFreshDatabase()
    beforeEach(async () => {
        app = await setUpApp()
    })

    test('POST /api/newsletter/subscribe - subscribe to newsletter', async () => {
        const response = await request(app)
            .post('/api/newsletter/subscribe')
            .send({ email })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(200)

        let exists =
            await Database.getInstance().models.NewsletterEmail.findOne({
                where: {
                    email,
                },
            })
        expect(exists).not.toBeNull()
    })

    test('POST /api/newsletter/subscribe - subscribe to newsletter with existing email', async () => {
        const response = await request(app)
            .post('/api/newsletter/subscribe')
            .send({ email })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(422)
    })

    test('POST /api/newsletter/unsubscribe - unsubscribe to newsletter', async () => {
        const response = await request(app)
            .post('/api/newsletter/unsubscribe')
            .send({ email })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(200)

        let exists =
            await Database.getInstance().models.NewsletterEmail.findOne({
                where: {
                    email,
                },
            })
        expect(exists).toBeNull()
    })

    test('POST /api/newsletter/unsubscribe - unsubscribe to newsletter with non existing email', async () => {
        const response = await request(app)
            .post('/api/newsletter/unsubscribe')
            .send({ email })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(404)
    })
})
