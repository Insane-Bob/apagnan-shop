import request from 'supertest'
import setUpApp from '../../app.js'
import { UserServices } from '../../Services/UserServices.js'
import { TokenServices } from '../../Services/TokenServices.js'
import { emptyTables, useFreshDatabase } from '../../tests/databaseUtils.js'
import { UserFactory } from '../../database/factories/UserFactory.js'
import { PaymentServices } from '../../Services/PaymentServices.js'
import { EmailSender } from '../../lib/EmailSender.js'
import {CaptchaValidator} from "../../Validator/CaptchaValidator.js";

let app = null

describe('AuthController test routes', () => {
    let baseCaptchaValidatorAfterValidation = CaptchaValidator.prototype.afterValidation
    useFreshDatabase(
        () => {
            CaptchaValidator.prototype.afterValidation = jest.fn(()=>true)
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
                password: 'BonjourJeSuisUnPassword75@!',
                passwordConfirmation: 'BonjourJeSuisUnPassword75@!',
                captcha: 'test',
                approveCGV_CGU: true,
            })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(422)
        PaymentServices.createCustomer.mockRestore()
    })

    // Without Accepting CGV
    test('POST /api/register - without CGV', async () => {
        PaymentServices.createCustomer = jest.fn()
        const response = await request(app)
            .post('/api/register')
            .send({
                ...UserFactory.instanciate(),
                password: 'BonjourJeSuisUnPassword75@!',
                passwordConfirmation: 'BonjourJeSuisUnPassword75@!',
                captcha: 'test',
                approveCGV_CGU: false,
            })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(422)
        PaymentServices.createCustomer.mockRestore()
    })

    test('POST /api/login - valid credentials', async () => {
    // Invalid Email Register Credentials
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
                captcha: 'test',
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

    test('POST /api/login - invalid captcha', async () => {
        CaptchaValidator.prototype.afterValidation = baseCaptchaValidatorAfterValidation
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
                captcha: 'invalid',
            })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(422)
        expect(response.body.errors[0].path).toBe('captcha')
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
