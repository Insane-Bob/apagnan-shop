import { Middleware } from '../../Core/Middleware.js'
import { UnauthorizedException } from '../../Exceptions/HTTPException.js'
import { TokenServices } from '../../Services/TokenServices.js'

/**
 * Retreive the user from the request
 */
export class AuthMiddleware extends Middleware {
    /**
     *
     * @param {Request} req
     * @param res
     * @param next
     */
    async handle(req, res, next) {
        const authorization = req.headers.get('authorization', null)
        if (!authorization) return next()
        // eslint-disable-next-line no-unused-vars
        const [_, accessToken] = authorization.split(' ')
        let decoded = null
        try {
            decoded = TokenServices.verifyAccessToken(accessToken)
        } catch (e) {
            UnauthorizedException.abort()
        }
        const token = await TokenServices.retrieveTokenFromIdentifier(
            decoded.id,
        )
        UnauthorizedException.abortIf(!token)
        req.setToken(token)

        const user = await TokenServices.retrieveUserFromToken(token, {
            include: 'Customer',
        })
        UnauthorizedException.abortIf(!user)
        user.customer = user?.Customer
        req.setUser(user)

        next()
    }
}
