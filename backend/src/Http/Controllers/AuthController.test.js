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

    // Invalid Password Register Credentials
    test('POST /api/register - Invalid Password', async () => {
        PaymentServices.createCustomer = jest.fn()
        const response = await request(app)
            .post('/api/register')
            .send({
                ...UserFactory.instanciate(),
                password: 'bonjourjesuisunmauvaispassaword',
                passwordConfirmation: 'bonjourjesuisunmauvaispassaword',
            })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(422)
        PaymentServices.createCustomer.mockRestore()
    })

    // Invalid Password Confirmation Register Credentials
    test('POST /api/register - Invalid Password Confirmation', async () => {
        PaymentServices.createCustomer = jest.fn()
        const response = await request(app)
            .post('/api/register')
            .send({
                ...UserFactory.instanciate(),
                password: 'BonjourJeSuisUnPassword75@!',
                passwordConfirmation: 'BonjourJeSuisUnMauvaisPassword75@!',
            })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(422)
        PaymentServices.createCustomer.mockRestore()
    })

    // Invalid Email Register Credentials
    test('POST /api/register - Invalid Email', async () => {
        PaymentServices.createCustomer = jest.fn()
        const response = await request(app)
            .post('/api/register')
            .send({
                ...UserFactory.instanciate(),
                email: 'bonjourjesuisunmauvaisemail',
            })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(422)
        PaymentServices.createCustomer.mockRestore()
    })

    // Invalid Email Already Exists
    test('POST /api/register - Email already in use', async () => {
        PaymentServices.createCustomer = jest.fn()
        const existingUser = await UserFactory.create({
            email: 'test@example.com',
        })
        const response = await request(app)
            .post('/api/register')
            .send({
                ...UserFactory.instanciate(),
                email: existingUser.email,
                password: 'BonjourJeSuisUnPassword75@!',
                passwordConfirmation: 'BonjourJeSuisUnPassword75@!',
            })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(422)
        PaymentServices.createCustomer.mockRestore()
    })

    // Missing Required Fields
    test('POST /api/register - Missing required fields', async () => {
        const response = await request(app)
            .post('/api/register')
            .send({
                password: 'BonjourJeSuisUnPassword75@!',
                passwordConfirmation: 'BonjourJeSuisUnPassword75@!',
            })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(422)
    })

    // Valid Register Credentials
    test('POST /api/register - Valid Credentials', async () => {
        PaymentServices.createCustomer = jest.fn()
        const response = await request(app)
            .post('/api/register')
            .send({
                ...UserFactory.instanciate(),
                password: 'BonjourJeSuisUnPassword75@!',
                passwordConfirmation: 'BonjourJeSuisUnPassword75@!',
            })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(200)
        PaymentServices.createCustomer.mockRestore()
    })

    // Valid Login Credentials
    test('POST /api/login - Valid Credentials', async () => {
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

        expect(response.statusCode).toBe(200)
        expect(UserServices.retrieveUserByEmail).toHaveBeenCalled()
        expect(UserServices.comparePassword).toHaveBeenCalled()

        const { accessToken, refreshToken, user } = response.body
        expect(accessToken).toBeDefined()
        expect(refreshToken).toBeDefined()
        expect(user?.email).toBe(userInstance.email)
    })

    // Valid User Access Token
    test('POST /api/me - Valid Token', async () => {
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
    })

    // Revoked User Access Token
    test('POST /api/me - Revoked Token', async () => {
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

    // Expired User Access Token
    test('POST /api/me - Expired Token', async () => {
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

    // No Token Provided
    test('POST /api/me - No token provided', async () => {
        const response = await request(app)
            .get('/api/me')
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(401)
    })
})
