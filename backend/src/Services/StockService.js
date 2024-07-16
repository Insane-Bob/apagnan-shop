import { Database } from '../Models/index.js'
import { ProductStockObserver } from '../Observers/ProductStockObserver.js'
import { ProductServices } from './ProductServices.js'

export class StockService {
    static async addStock(productId, quantity, ...args) {
        let res = await Database.getInstance().models.StockTransaction.create(
            {
                productId: productId,
                quantity: quantity,
                createdAt: new Date(),
            },
            ...args,
        )
        ProductStockObserver.getInstance().broadcast({
            productId: productId,
        })
        await this.broadcastStock(productId)
        return res
    }

    static async removeStock(productId, quantity, ...args) {
        let res = await Database.getInstance().models.StockTransaction.create(
            {
                productId: productId,
                quantity: -quantity,
                createdAt: new Date(),
            },
            ...args,
        )
        await this.broadcastStock(productId)
        return res
    }

    static async broadcastStock(productId) {
        let product =
            await Database.getInstance().models.Product.findByPk(productId)
        product = await ProductServices.loadRemainingStock(product)
        ProductStockObserver.getInstance().broadcast(product)
    }
}
