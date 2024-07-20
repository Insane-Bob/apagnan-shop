import request from 'supertest'
import setUpApp from '../../app.js'
import { UserServices } from '../../Services/UserServices.js'
import { TokenServices } from '../../Services/TokenServices.js'
import { emptyTables, useFreshDatabase } from '../../tests/databaseUtils.js'
import { UserFactory } from '../../database/factories/UserFactory.js'
import { PaymentServices } from '../../Services/PaymentServices.js'
import { EmailSender } from '../../lib/EmailSender.js'

let app = null
describe('AuthController test routes', () => {
    useFreshDatabase(
        () => {
            EmailSender.send = jest.fn()
        },
        () => {
            EmailSender.send.mockRestore()
        },
    )
    beforeEach(async () => {
        await emptyTables()
        app = await setUpApp()
    })

    test('POST /api/register - valid credentials', async () => {
        PaymentServices.createCustomer = jest.fn()
        const response = await request(app)
            .post('/api/register')
            .send({
                ...UserFactory.instanciate(),
                password: 'BonjourJeSuisUnPassword75@!',
                passwordConfirmation: 'BonjourJeSuisUnPassword75@!',
            })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(201)
        PaymentServices.createCustomer.mockRestore()
    })

    test('POST /api/login - valid credentials', async () => {
        UserServices.comparePassword = jest.fn(UserServices.comparePassword)
        UserServices.retrieveUserByEmail = jest.fn(
            UserServices.retrieveUserByEmail,
        )

        const userInstance = await UserFactory.withCustomer().create({
            password: 'BonjourJeSuisUnPassword75@!',
            emailVerifiedAt: new Date(),
        })
        const response = await request(app)
            .post('/api/login')
            .send({
                email: userInstance.email,
                password: 'BonjourJeSuisUnPassword75@!',
            })
            .set('Accept', 'application/json')

        expect(response.statusCode).toBe(200)
        expect(UserServices.retrieveUserByEmail).toHaveBeenCalled()
        expect(UserServices.comparePassword).toHaveBeenCalled()

        const { accessToken, refreshToken, user } = response.body
        expect(accessToken).toBeDefined()
        expect(refreshToken).toBeDefined()
        expect(user?.email).toBe(userInstance.email)
    })

    test('POST /api/login - not verifed account', async () => {
        UserServices.comparePassword = jest.fn(UserServices.comparePassword)
        UserServices.retrieveUserByEmail = jest.fn(
            UserServices.retrieveUserByEmail,
        )

        const userInstance = await UserFactory.withCustomer().create({
            password: 'BonjourJeSuisUnPassword75@!',
        })
        const response = await request(app)
            .post('/api/login')
            .send({
                email: userInstance.email,
                password: 'BonjourJeSuisUnPassword75@!',
            })
            .set('Accept', 'application/json')

        expect(response.statusCode).toBe(422)
    })

    test('POST /api/me - valid token', async () => {
        const userInstance = await UserFactory.withCustomer().create({
            password: 'BonjourJeSuisUnPassword75@!',
        })
        const token = await TokenServices.createToken(userInstance.id)
        const accessToken = TokenServices.generateAccessToken(token)

        TokenServices.retrieveTokenFromIdentifier = jest.fn((_) => token)
        TokenServices.retrieveUserFromToken = jest.fn((token) => ({
            id: token.userId,
        }))

        const response = await request(app)
            .get('/api/me')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        expect(TokenServices.retrieveTokenFromIdentifier.mock.calls[0][0]).toBe(
            token.identifier,
        )
        expect(TokenServices.retrieveUserFromToken.mock.calls[0][0]).toBe(token)
        expect(response.statusCode).toBe(200)
        expect(response.body?.user?.id).toBe(userInstance.id)

        TokenServices.retrieveTokenFromIdentifier.mockRestore()
        TokenServices.retrieveUserFromToken.mockRestore()
    })

    test('POST /api/me - revoked token', async () => {
        const userInstance = await UserFactory.withCustomer().create({
            password: 'BonjourJeSuisUnPassword75@!',
        })

        const token = await TokenServices.createToken(userInstance.id)
        const accessToken = TokenServices.generateAccessToken(token)
        await TokenServices.revokeToken(token)

        const response = await request(app)
            .get('/api/me')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
        expect(response.statusCode).toBe(401)
    })

    test('POST /api/me - expired token', async () => {
        const userInstance = await UserFactory.withCustomer().create({
            password: 'BonjourJeSuisUnPassword75@!',
        })

        const token = await TokenServices.createToken(userInstance.id)
        token.expireAt = new Date('2021-01-01')
        await token.save()
        const accessToken = TokenServices.generateAccessToken(token)
        const response = await request(app)
            .get('/api/me')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
        expect(response.statusCode).toBe(401)
    })
})
