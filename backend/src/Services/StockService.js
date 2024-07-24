import { Database } from '../Models/index.js'
import { ProductStockObserver } from '../Observers/ProductStockObserver.js'
import { ProductServices } from './ProductServices.js'
import { NotificationsServices } from './NotificationsServices.js'

export class StockService {
    static async addStock(productId, quantity, options) {
        let res = await Database.getInstance().models.StockTransaction.create(
            {
                productId: productId,
                quantity: quantity,
                createdAt: new Date(),
            },
            options,
        )
        if (options?.transaction) {
            options.transaction.afterCommit(async () => {
                await this.broadcastStock(productId)
            })
        } else await this.broadcastStock(productId)
        return res
    }

    static async removeStock(productId, quantity, options) {
        let res = await Database.getInstance().models.StockTransaction.create(
            {
                productId: productId,
                quantity: -quantity,
                createdAt: new Date(),
            },
            options,
        )
        if (options?.transaction) {
            options.transaction.afterCommit(async () => {
                await this.broadcastStock(productId)
            })
        } else await this.broadcastStock(productId)
        return res
    }

    static async broadcastStock(productId) {
        let product =
            await Database.getInstance().models.Product.findByPk(productId)
        product = await ProductServices.loadRemainingStock(product)
        ProductStockObserver.getInstance().broadcast(product)
    }

    static async checkStockForAdminNotif(productId) {
        const product =
            await Database.getInstance().models.Product.findByPk(productId)
        await ProductServices.loadRemainingStock(product)
        if (product.stock === 0) {
            await NotificationsServices.notifyOutOfStockProduct(product)
        }
        if (product.stock < product.lowStockValue) {
            await NotificationsServices.notifyLowStockProduct(product)
        }
    }
}
