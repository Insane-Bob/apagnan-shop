import { Controller } from '../../Core/Controller.js'
import { UserPolicy } from '../Policies/UserPolicy.js'
import { OrderValidator } from '../../Validator/OrderValidator.js'
import { Database } from '../../Models/index.js'
import { PaymentServices } from '../../Services/PaymentServices.js'
import { AskResetPasswordValidator } from '../../Validator/AskForRefundValidator.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'
import { OrderPolicy } from '../Policies/OrderPolicy.js'

export class OrderController extends Controller {
    user_resource /** @provide by UserProvider */
    customer /** @provide by CustomerProvider */
    order /** @provide by OrderProvider */

    async index() {
        this.can(UserPolicy.show, this.user_resource)
        this.res.json({
            orders: await this.customer.getOrders(),
        })
    }
    show() {
        this.can(OrderPolicy.show, this.order)
        this.res.json(this.order)
    }
    async store() {
        this.can(UserPolicy.update, this.user_resource)
        const payload = this.validate(OrderValidator)

        await Database.getInstance().models.Order.create({
            ...payload,
            customerId: this.customer.id,
        })

        await this.index()
    }
    async update() {
        this.can(OrderPolicy.show, this.order)
        const payload = this.validate(OrderValidator)

        await this.order.update(payload)

        await this.index()
    }

    async delete() {
        this.can(OrderPolicy.show, this.order)
        await this.order.destroy()
        await this.index()
    }

    async pay() {
        this.can(OrderPolicy.show, this.order)
        const session = await PaymentServices.createCheckoutSession(this.order)
        this.res.json(session)
    }

    async askForRefund() {
        this.can(OrderPolicy.show, this.order)
        const payload = this.validate(AskResetPasswordValidator)

        //@TODO : handle the choice of the items and the quantity to refund

        const refundRequest = await PaymentServices.askForRefund(
            this.order,
            payload.reason,
        )

        await NotificationsServices.notifyNewRefundRequest(refundRequest)
        await NotificationsServices.notifyACKRefund(
            this.customer,
            refundRequest,
        )

        this.res.json({
            message: 'Refund requested',
        })
    }
}
