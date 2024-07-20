import { Factory } from './Factory.js'
import { faker } from '@faker-js/faker'
import { CollectionFactory } from './CollectionFactory.js'
import { StockService } from '../../Services/StockService.js'
import { ProductSpecificsFactory } from './ProductSpecificsFactory.js'

export class ProductFactory extends Factory {
    static model = 'Product'
    static async instanciate(obj) {
        let collectionParts = {}
        if (!obj?.collectionId) {
            const collection = await CollectionFactory.create()
            collectionParts = { collectionId: collection.id }
        }
        return {
            name: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            published: faker.datatype.boolean(),
            ...collectionParts,
        }
    }

    static _withStock = false
    static withStock(quantity = 10) {
        this._withStock = quantity
        return this
    }

    static _withSpecifics = false
    static withSpecifics() {
        this._withSpecifics = true
        return this
    }

    static async afterCreate(product) {
        if (this._withStock) {
            await StockService.addStock(product.id, this._withStock)
            await product.getStock()
        }
        if (this._withSpecifics) {
            product.specifics = await ProductSpecificsFactory.count(
                faker.number.int({ min: 1, max: 5 }),
            ).create({
                productId: product.id,
            })
        }
    }
}
