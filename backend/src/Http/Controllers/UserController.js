import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { UserPolicy } from '../Policies/UserPolicy.js'
import { UserUpdateValidator } from '../../Validator/UserUpdateValidator.js'
import { UserServices } from '../../Services/UserServices.js'
import { AskResetPasswordValidator } from '../../Validator/AskResetPasswordValidator.js'
import { AccessLinkServices } from '../../Services/AccessLinkServices.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'
import { USER_ROLES } from '../../Models/user.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'

export class UserController extends Controller {
    user_resource /** @provide by UserProvider */
    async index() {
        // this.can(UserPolicy.index)
        const users = await Database.getInstance().models.User.findAll()
        this.res.json({
            users,
        })
    }
    
    async show() {
        this.can(UserPolicy.show, this.user_resource)
        this.res.json(this.user_resource)
    }

    async update() {
        this.can(UserPolicy.update, this.user_resource)

        const payload = this.validate(
            UserUpdateValidator,
            this.req.user.hasRole(USER_ROLES.ADMIN)
                ? UserUpdateValidator.updateAdmin()
                : UserUpdateValidator.update(),
        )

        const rowsEdited = await this.user_resource.update(payload)
        NotFoundException.abortIf(rowsEdited === 0)

        if (payload.password) {
            await Database.getInstance().models.UserConnectionAttempt.update(
                {
                    success: true,
                },
                {
                    where: {
                        userId: this.user_resource.id,
                    },
                },
            )
            await NotificationsServices.notifyResetPassword(this.user_resource)
        }

        if (payload.email != this.user_resource.email)
            await NotificationsServices.notifyValidateEmail(this.user_resource)

        this.res.json(this.user_resource)
    }

    async delete() {
        this.can(UserPolicy.delete, this.user_resource)
        const rowsDeleted = await this.user_resource.destroy()
        NotFoundException.abortIf(rowsDeleted === 0)
        this.res.json({
            message: 'User deleted',
            success: true,
        })
    }

    async askResetPassword() {
        const { email } = this.validate(AskResetPasswordValidator)
        console.log(email);
        const user = await UserServices.retrieveUserByEmail(email)

        if (user) {
            const accessLink = await AccessLinkServices.createAccessLink(
                user.id,
                AccessLinkServices.getDate(),
                AccessLinkServices.getDate(20),
                1,
            )

            await NotificationsServices.notifyResetPassword(
                user,
                accessLink.identifier,
            )
        } else {
            await new Promise((resolve) => setTimeout(resolve, 10)) // simulate a slow response
        }

        this.res.status(202).json({
            message:
                'Reset password link sent if the email exists, check your inbox',
            success: true,
        })
    }

    async activateAccount() {        
        const user = this.user_resource
        NotFoundException.abortIf(user.isActive, 'Account already activated')
        UserServices.activateUserAccount(user)
        await NotificationsServices.notifyAccountActivated(user)

        this.res.json({
            message: 'Account activated',
            success: true,
        })
    }
}
