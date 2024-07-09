import { Database } from '../Models/index.js'
import { Op } from 'sequelize'
import { StockService } from '../Services/StockService.js'

export class ProductBasketCleanerJob {
    get name() {
        return this.constructor.name
    }

    async execute() {
        const MIN = process.env.PRODUCT_BASKET_CLEANER_MINUTES || 15
        const basketsItems =
            await Database.getInstance().models.UserBasket.findAll({
                where: {
                    updatedAt: {
                        [Op.lt]: new Date(new Date() - MIN * 60 * 1000),
                    },
                },
                include: [
                    {
                        model: Database.getInstance().models.StockTransaction,
                        as: 'stockTransaction',
                    },
                ],
            })

        const basketsIds = []
        for (const item of basketsItems) {
            console.log(item)
            try {
                await StockService.addStock(
                    item.stockTransaction.productId,
                    item.quantity,
                )
                basketsIds.push(item.id)
            } catch (e) {
                console.error(e)
            }
        }

        await Database.getInstance().models.UserBasket.destroy({
            where: {
                id: {
                    [Op.in]: basketsIds,
                },
            },
        })
    }
}
