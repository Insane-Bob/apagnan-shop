import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { UserPolicy } from '../Policies/UserPolicy.js'
import { UserUpdateValidator } from '../../Validator/UserUpdateValidator.js'
import { UserServices } from '../../Services/UserServices.js'
export class UserController extends Controller {
    user_resource /** @provide by UserProvider */
    async index() {
        this.can(UserPolicy.index)
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
        const payload = this.validate(UserUpdateValidator)

        if (payload.password)
            payload.password = UserServices.hashPassword(payload.password)

        await this.user_resource.update({
            ...payload,
        })

        this.res.json(this.user_resource)
    }

    async delete() {
        this.can(UserPolicy.delete, this.user_resource)
        await this.user_resource.destroy()

        this.res.json({
            message: 'User deleted',
            success: true,
        })
    }
}
