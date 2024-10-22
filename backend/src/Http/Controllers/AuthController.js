import { Controller } from '../../Core/Controller.js'
import {
    UnauthorizedException,
    UnprocessableEntity,
} from '../../Exceptions/HTTPException.js'
import { Database } from '../../Models/index.js'
import { AccessLinkServices } from '../../Services/AccessLinkServices.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'
import { TokenServices } from '../../Services/TokenServices.js'
import { UserServices } from '../../Services/UserServices.js'
import { AskResetPasswordValidator } from '../../Validator/AskResetPasswordValidator.js'
import { LoginValidator } from '../../Validator/LoginValidator.js'
import { RegisterValidator } from '../../Validator/RegisterValidator.js'
import { ValidationException } from '../../Exceptions/ValidationException.js'
import { CaptchaValidator } from '../../Validator/CaptchaValidator.js'
import { CGUCGVValidator } from '../../Validator/CGUCGVValidator.js'

export class AuthController extends Controller {
    async login() {
        await this.validate(CaptchaValidator)
        const { email, password } = this.validate(LoginValidator)

        const user = await UserServices.retrieveUserByEmail(email)
        ValidationException.abortIf(!user, [
            {
                path: 'email',
                message: 'Les identifiants sont incorrects',
            },
            {
                path: 'password',
                message: 'Les identifiants sont incorrects',
            },
        ])
        ValidationException.abortIf(!(await user.canConnect()), [
            {
                path: 'email',
                message: 'Votre compte est bloqué',
            },
        ])

        const database = Database.getInstance()

        if (!UserServices.comparePassword(password, user.password)) {
            await database.models.UserConnectionAttempt.create({
                userId: user.id,
                success: false,
            })
            if (!(await user.canConnect())) {
                const accessLink = await AccessLinkServices.createAccessLink(
                    user.id,
                    AccessLinkServices.getDate(),
                    AccessLinkServices.getDate(20),
                    1,
                )
                await NotificationsServices.notifyConnectionAttempt3Failed(
                    user,
                    accessLink.identifier,
                )
            }
            ValidationException.abort([
                {
                    path: 'email',
                    message: 'Les identifiants sont incorrects',
                },
                {
                    path: 'password',
                    message: 'Les identifiants sont incorrects',
                },
            ])
        } else {
            await database.models.UserConnectionAttempt.create({
                userId: user.id,
                success: true,
            })
        }

        ValidationException.abortIf(!user.isEmailVerified(), [
            {
                path: 'email',
                message: 'Votre email doit être vérifié afin de vous connecter',
            },
        ])

        const token = await TokenServices.createToken(user.id)
        const accessToken = TokenServices.generateAccessToken(token)

        this.res.json({
            accessToken,
            refreshToken: token.refreshToken,
            user,
        })
    }

    async loginWithAccessLink() {
        const identifier = this.req.params.get('identifier', null)
        const accessLink =
            await AccessLinkServices.retrieveAccessLinkByIdentifier(identifier)

        UnauthorizedException.abortIf(!accessLink, 'Access link is invalid')
        UnauthorizedException.abortIf(
            !accessLink.isValid,
            'Access link is invalid',
        )

        const user = await Database.getInstance().models.User.findByPk(
            accessLink.userId,
        )
        UnauthorizedException.abortIf(!user, 'User not found')
        UnauthorizedException.abortIf(
            !(await user.canConnect()),
            'Too many attempts',
        )

        await accessLink.update({
            useCount: accessLink.useCount + 1,
        })

        const token = await TokenServices.createToken(accessLink.userId)
        const accessToken = TokenServices.generateAccessToken(token)

        this.res.json({
            accessToken,
            refreshToken: token.refreshToken,
        })
    }

    async register() {
        await this.validate(CaptchaValidator)
        const { firstName, lastName, email, password } =
            this.validate(RegisterValidator)
        this.validate(CGUCGVValidator)

        const userExist = await UserServices.retrieveUserByEmail(email)
        ValidationException.abortIf(userExist, [
            {
                path: 'email',
                message: 'Email déjà utilisé',
            },
        ])

        try {
            const user = await UserServices.registerUser(
                firstName,
                lastName,
                email,
                password,
            )
            const accessLink = await AccessLinkServices.createAccessLink(
                user.id,
                AccessLinkServices.getDate(),
                AccessLinkServices.getDate(20),
                1,
            )
            await NotificationsServices.notifyRegisterUser(user, accessLink)
            this.res.status(201).json(user)
        } catch (e) {
            throw e
        }
    }

    async resendActivationEmail() {
        const { email } = this.validate(AskResetPasswordValidator)

        const user = await UserServices.retrieveUserByEmail(email)
        UnauthorizedException.abortIf(!user, 'User not found')
        UnauthorizedException.abortIf(
            user.isActive,
            'User is already activated',
        )

        const accessLink = await AccessLinkServices.createAccessLink(
            user.id,
            AccessLinkServices.getDate(),
            AccessLinkServices.getDate(20),
            1,
        )
        await NotificationsServices.notifyRegisterUser(user, accessLink)

        this.res.json({
            message: 'Activation email sent',
        })
    }

    async logout() {
        UnauthorizedException.abortIf(
            !this.req.user || !this.req.token,
            'User is not authenticated',
        )
        await TokenServices.revokeToken(this.req.token)
        this.res.json({ message: 'User logged out', success: true })
    }

    async refreshToken() {
        const { refreshToken } = this.req.body.all()

        const token =
            await TokenServices.retrieveTokenFromRefreshToken(refreshToken)
        UnauthorizedException.abortIf(!token, 'Refresh token is invalid')

        const user = await TokenServices.retrieveUserFromToken(token)
        UnprocessableEntity.abortIf(!user, 'Refresh token is invalid')

        const expireAt = new Date(token.expireAt)
        expireAt.setDate(
            expireAt.getDate() +
                Number(process.env.REFRESH_TOKEN_EXPIRATION || 30),
        ) //eslint-disable-line no-undef
        UnauthorizedException.abortIf(
            expireAt < new Date(),
            'Refresh token has expired',
        )

        const newToken = await TokenServices.createToken(user.id)
        await TokenServices.revokeToken(token)

        this.res.json({
            accessToken: TokenServices.generateAccessToken(newToken),
            refreshToken: newToken.refreshToken,
        })
    }

    me() {
        UnauthorizedException.abortIf(
            !this.req.user,
            'User is not authenticated',
        )
        this.res.json({
            user: this.req.user,
        })
    }
}
