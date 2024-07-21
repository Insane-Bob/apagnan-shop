import { Database } from '../Models/index.js'
import { ProductServices } from './ProductServices.js'
import { StockService } from './StockService.js'

export class UserBasketServices {
    /**
     * @param userID
     * @returns {Promise<Array<{productId:interger, quantity:integer}>>}
     */
    static async getUserBasketSelfQuantity(userID) {
        const sql = `
            SELECT SUM(quantity) as quantity, "productId" from "UserBaskets"
            JOIN "StockTransactions" ON "stockTransactionId" = "StockTransactions"."id"
            WHERE "userId" = :userID GROUP BY "productId"
        `
        const [result] = await Database.getInstance().query(sql, {
            replacements: { userID },
        })
        return result
    }

    static async getUserBasket(userID) {
        let basketsItems =
            await Database.getInstance().models.UserBasket.findAll({
                where: {
                    userId: userID,
                },
                include: [
                    {
                        model: Database.getInstance().models.StockTransaction,
                        as: 'stockTransaction',
                        include: [
                            {
                                model: Database.getInstance().models.Product,
                                as: 'Product',
                                include:{
                                    association: 'images',
                                }
                            },
                        ],
                    },
                ],
            })

        await Promise.all(
            basketsItems.map((item) =>
                ProductServices.loadRemainingStock(
                    item.stockTransaction.Product,
                ),
            ),
        )
        return basketsItems
    }
    static async addProductToBasket(userID, productID, quantity) {
        const existingBasket = await this.#retrieveBasket(userID, productID)

        if (existingBasket && existingBasket.id) {
            await Database.getInstance().models.StockTransactions.update(
                {
                    quantity: -quantity,
                },
                {
                    where: {
                        id: existingBasket.stockTransactionId,
                    },
                },
            )
        } else {
            const transaction = await StockService.removeStock(
                productID,
                quantity,
            )

            await Database.getInstance().models.UserBasket.create({
                userId: userID,
                stockTransactionId: transaction.id,
            })
        }
    }

    static async removeProductFromBasket(userID, productID, options = {}) {
        const existingBasket = await this.#retrieveBasket(userID, productID)
        if (!existingBasket) return
        if (!existingBasket.id) return

        let transaction = options?.transaction || null
        let selfTransaction = null
        if (transaction) {
            selfTransaction = transaction
        } else {
            selfTransaction = await Database.transaction()
        }

        try {
            existingBasket.stockTransaction =
                await existingBasket.getStockTransaction()
            await StockService.addStock(productID, existingBasket.quantity, {
                transaction: selfTransaction,
            })
            await existingBasket.destroy({ selfTransaction })
            if (!transaction) await selfTransaction.commit()
        } catch (e) {
            if (!transaction) await selfTransaction.rollback()
            throw e
        }
    }

    static async #retrieveBasket(userID, productID) {
        const existingBasketSQL = `
            SELECT * FROM "UserBaskets" 
                     WHERE "userId" = :userID 
                           AND "stockTransactionId" IN 
                               (SELECT "id" FROM "StockTransactions"
                                          WHERE "productId" = :productID)
        `
        const [existingBasket] = await Database.getInstance().query(
            existingBasketSQL,
            {
                replacements: { userID, productID },
            },
        )

        if (!existingBasket.length) return null
        const model = Database.getInstance().models.UserBasket
        return new model(existingBasket[0])
    }
}
