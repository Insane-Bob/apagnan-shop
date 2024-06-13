import { useFreshDatabase } from '../tests/databaseUtils.js'
import { UserServices } from './UserServices.js'
import { TokenServices } from './TokenServices.js'
import { Database } from '../Models/index.js'

describe('TokenServices', () => {
    let user = null
    let token = null
    useFreshDatabase(async () => {
        user = await UserServices.registerUser(
            'Test',
            'User',
            'TokenServices@email.com',
            'password',
        )
        return user
    })

    test('createToken', async () => {
        token = await TokenServices.createToken(user.id)
        expect(token).toBeDefined()
        expect(token.identifier).toBeDefined()
        expect(token.userId).toBe(user.id)
    })

    test('retrieveTokenFromIdentifier', async () => {
        const tokenFromIdentifier =
            await TokenServices.retrieveTokenFromIdentifier(token.identifier)
        expect(tokenFromIdentifier).toBeDefined()
        expect(tokenFromIdentifier.id).toBe(token.id)
    })

    test('generateAccessToken and verify', async () => {
        const accessToken = TokenServices.generateAccessToken(token)
        expect(accessToken).toBeDefined()
        const decoded = TokenServices.verifyAccessToken(accessToken)
        expect(decoded).toBeDefined()
        expect(decoded.id).toBe(token.identifier)
        expect(decoded.exp).toBe(Math.round(token.expireAt.getTime() / 1000))
    })

    test('Generate refresh token and retreive from refresh token', async () => {
        expect(token.refreshToken.length).toBe(128)
        const tokenFromRefreshToken =
            await TokenServices.retrieveTokenFromRefreshToken(
                token.refreshToken,
            )
        expect(tokenFromRefreshToken).toBeDefined()
        expect(tokenFromRefreshToken?.id).toBe(token.id)
    })

    test('retrieveUserFromToken', async () => {
        const user = await TokenServices.retrieveUserFromToken(token)
        expect(user).toBeDefined()
        expect(user.id).toBe(token.userId)
    })

    test('revockeToken and check that is not retreivable', async () => {
        await TokenServices.revokeToken(token)
        const tokenFromIdentifier =
            await TokenServices.retrieveTokenFromIdentifier(token.identifier)
        expect(tokenFromIdentifier).toBeNull()
    })
})
