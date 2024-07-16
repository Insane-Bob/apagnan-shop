import { Controller } from '../../Core/Controller.js'
import { DeliveryPolicy } from '../Policies/DeviveryPolicy.js'
import { DeliveryValidator } from '../../Validator/DeliveryValidator.js'
import { Database } from '../../Models/index.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'

export class DeliveryController extends Controller {
    delivery
    async show() {
        const order = await this.delivery.getOrder()
        this.can(DeliveryPolicy.show, order)

        this.res.json({
            delivery: this.delivery,
            order: order,
        })
    }

    async create() {
        this.can(DeliveryPolicy.create)
        const payload = this.validate(DeliveryValidator)

        const order = await Database.getInstance().models.Order.findByPk(
            payload.orderId,
        )
        NotFoundException.abortIf(!order)

        this.delivery = await this.delivery.create(payload)

        await this.show()
    }
}
