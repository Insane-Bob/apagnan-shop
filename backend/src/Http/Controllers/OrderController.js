import { Controller } from '../../Core/Controller.js'
import { UserPolicy } from '../Policies/UserPolicy.js'
import { OrderValidator } from '../../Validator/OrderValidator.js'
import { Database } from '../../Models/index.js'

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
        this.can(UserPolicy.show, this.user_resource)
        this.res.json(this.order)
    }
    async store() {
        this.can(UserPolicy.update, this.user_resource)
        const payload = this.validate(OrderValidator)

        await Database.getInstance().models.Order.create({
            ...payload,
            customer_id: this.customer.id,
        })

        await this.index()
    }
    async update() {
        this.can(UserPolicy.update, this.user_resource)
        const payload = this.validate(OrderValidator)

        await this.order.update(payload)

        await this.index()
    }

    async delete() {
        this.can(UserPolicy.update, this.user_resource)
        await this.order.destroy()
        await this.index()
    }
}
