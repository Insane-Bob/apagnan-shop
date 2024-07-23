import { Controller } from '../../Core/Controller.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'
import { Database } from '../../Models/index.js'

export class EmailController extends Controller {
    async sendOrderSupportedEmail() {
        const user = await Database.getInstance().models.User.findOne({
            where: {
                id: this.req.getUser().id,
            },
            attributes: ['firstName', 'lastName', 'email'],
        })

        const order = this.req.params.get('orderId')

        // @TODO: Replace user by this.req.user
        await NotificationsServices.notifyOrderSupported(user, order)
    }
}
