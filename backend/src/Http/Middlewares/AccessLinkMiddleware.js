import { Middleware } from '../../Core/Middleware.js'
import { UnauthorizedException } from '../../Exceptions/HTTPException.js'
import { TokenServices } from '../../Services/TokenServices.js'
import { AccessLinkServices } from '../../Services/AccessLinkServices.js'

/**
 * Retreive the user from the request
 */
export class AccessLinkMiddleware extends Middleware {
    /**
     *
     * @param {Request} req
     * @param res
     * @param next
     */
    async handle(req, res, next) {
        const identifier = req.query.get('a', null)
        if (!identifier) return next()

        const accessLink =
            await AccessLinkServices.retrieveAccessLinkByIdentifier(identifier)
        UnauthorizedException.abortIf(!accessLink, 'Access link is invalid')
        UnauthorizedException.abortIf(
            !accessLink.isValid,
            'Access link is invalid',
        )

        await accessLink.update({
            useCount: accessLink.useCount + 1,
        })

        const token = await TokenServices.createToken(accessLink.userId)
        const accessToken = TokenServices.generateAccessToken(token)
        req.headers.set('authorization', `Bearer ${accessToken}`)

        next()
    }
}
