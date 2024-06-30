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

export class AuthController extends Controller {
    async login() {
        const { email, password } = this.validate(LoginValidator)

        const user = await UserServices.retrieveUserByEmail(email)
        UnprocessableEntity.abortIf(!user, 'Invalid credentials')
        UnprocessableEntity.abortIf(
            !(await user.canConnect()),
            'Too many attempts',
        )

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
            UnauthorizedException.abort()
        } else {
            await database.models.UserConnectionAttempt.create({
                userId: user.id,
                success: true,
            })
        }

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
        const accessLinkIdentifier =
            await AccessLinkServices.retrieveAccessLinkByIdentifier(identifier)

        UnauthorizedException.abortIf(
            !accessLinkIdentifier,
            'Access link is invalid',
        )
        UnauthorizedException.abortIf(
            !accessLinkIdentifier.isValid,
            'Access link is invalid',
        )

        const user = await Database.getInstance().models.User.findByPk(
            accessLinkIdentifier.userId,
        )
        UnauthorizedException.abortIf(!user, 'User not found')
        UnauthorizedException.abortIf(
            !(await user.canConnect()),
            'Too many attempts',
            await NotificationsServices.notifyConnectionAttempt3Failed(
                user,
                accessLinkIdentifier,
            ),
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
        const { firstName, lastName, email, password } =
            this.validate(RegisterValidator)

        const result = AuthController.schema.safeParse({
            firstName,
            lastName,
            email,
            password,
        })

        try {
            const user = await UserServices.registerUser(
                firstName,
                lastName,
                email,
                password,
            )
            // const emailInstance = new RegisterEmail()
            //     .setParams({
            //         name: 'Ilyam Dupuis',
            //     })
            //     .addTo('ilyamdupuis0903@gmail.com', `${firstName} ${lastName}`)
            // await EmailSender.send(emailInstance)
            this.res.status(202).json(user)
        } catch (e) {
            throw e
        }
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

    async resetPassword() {
        const { email } = this.validate(AskResetPasswordValidator)

        const user = await UserServices.retrieveUserByEmail(email)
        UnauthorizedException.abortIf(!user, 'User not found')

        await NotificationsServices.notifyResetPassword(user)

        this.res.json({
            message: 'An email has been sent to reset your password',
        })
    }

    async activationEmail() {
        const { email } = this.req.body.all()

        const user = await UserServices.retrieveUserByEmail(email)
        UnauthorizedException.abortIf(!user, 'User not found')

        await NotificationsServices.notifyActivationEmail(user)

        this.res.json({
            message: 'An email has been sent to activate your account',
        })
    }

    async activateAccount() {
        const user = await UserServices.retrieveUserByToken(token)
        UnauthorizedException.abortIf(!user, 'User not found')

        // Activate user account and send notification
        UserServices.activateUserAccount(user)
        NotificationsServices.notifyAccountActivated(user)

        this.res.json({
            message: 'Account activated',
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
