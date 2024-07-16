import { Factory } from './Factory.js'
import { faker } from '@faker-js/faker'
import { CollectionFactory } from './CollectionFactory.js'
import { OrderDetailsFactory } from './OrderDetailsFactory.js'
export class OrderFactory extends Factory {
    static model = 'Order'
    static async instanciate() {
        const collection = await CollectionFactory.create()
        return {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            published: faker.datatype.boolean(),
            collectionId: collection.id,
        }
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
