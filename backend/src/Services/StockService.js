import { Database } from '../Models/index.js'

export class StockService {
    static addStock(productId, quantity, ...args) {
        return Database.getInstance().models.StockTransaction.create(
            {
                productId: productId,
                quantity: quantity,
                createdAt: new Date(),
            },
            ...args,
        )
    }

    static removeStock(productId, quantity, ...args) {
        return Database.getInstance().models.StockTransaction.create(
            {
                productId: productId,
                quantity: -quantity,
                createdAt: new Date(),
            },
            ...args,
        )
    }
}
