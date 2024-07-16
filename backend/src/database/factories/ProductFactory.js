import { Factory } from './Factory.js'
import { faker } from '@faker-js/faker'
import { CollectionFactory } from './CollectionFactory.js'
import { StockService } from '../../Services/StockService.js'

export class ProductFactory extends Factory {
    static model = 'Product'
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

    static _withStock = false
    static withStock(quantity = 10) {
        this._withStock = quantity
        return this
    }

    static async afterCreate(product) {
        if (this._withStock) {
            await StockService.addStock(product.id, this._withStock)
            await product.getStock()
        }
    }
}
