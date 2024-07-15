import { Controller } from '../../Core/Controller.js'
import { UserWidgetPolicy } from '../Policies/UserWidgetPolicy.js'
import { Database } from '../../Models/index.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'
import { UserWidgetValidator } from '../../Validator/UserWidgetValidator.js'

export class UserWidgetController extends Controller {
    user_resource // @provided UserProvider
    widget // @provided UserWidgetProvider
    async showUserWidget() {
        this.can(UserWidgetPolicy.show, this.user_resource)
        this.widget = await Database.getInstance().models.UserWidget.findOne({
            where: {
                userId: this.user_resource.id,
            },
        })
        NotFoundException.abortIf(!this.widget)
        this.widget = JSON.parse(this.widget.data)
        this.res.json(this.widget)
    }

    async put() {
        this.can(UserWidgetPolicy.show, this.user_resource)
        const payload = this.validate(UserWidgetValidator)
        await Database.getInstance().models.UserWidget.destroy({
            where: {
                userId: this.user_resource.id,
            },
        })
        await Database.getInstance().models.UserWidget.create(
            {
                userId: this.user_resource.id,
                data: JSON.stringify(payload.data),
            },
            {
                where: {
                    userId: this.user_resource.id,
                },
            },
        )
        this.res.sendStatus(200)
    }
}
