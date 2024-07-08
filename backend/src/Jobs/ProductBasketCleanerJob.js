import { Database } from '../Models/index.js'
import { Op } from 'sequelize'

export class ProductBasketCleanerJob {
    get name() {
        return this.constructor.name
    }

    async execute() {
        const MIN = process.env.PRODUCT_BASKET_CLEANER_MINUTES || 15
        await Database.getInstance().models.UserBasket.destroy({
            where: {
                updatedAt: {
                    [Op.lt]: new Date(new Date() - MIN * 60 * 1000),
                },
            },
        })
    }
}
