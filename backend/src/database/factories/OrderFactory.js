import { Factory } from './Factory.js'
import { OrderDetailsFactory } from './OrderDetailsFactory.js'
export class OrderFactory extends Factory {
    static model = 'Order'
    static async instanciate() {
        return {}
    }

    static _withDetails = false
    static withDetails(details) {
        if (!details) return this
        this._withDetails = details
        return this
    }

    static async afterCreate(order) {
        if (this._withDetails) {
            for (let detail of this._withDetails) {
                await OrderDetailsFactory.count(1).create({
                    ...detail,
                    orderId: order.id,
                })
            }
        }
    }
}
