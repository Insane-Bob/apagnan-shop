import { Database } from '../Models/index.js'
import { ProductServices } from './ProductServices.js'

export class UserBasketServices {
    static async getUserBasket(userID) {
        let basketsItems =
            await Database.getInstance().models.UserBasket.findAll({
                where: {
                    userId: userID,
                },
                include: Database.getInstance().models.Product,
            })

        await Promise.all(
            basketsItems.map((item) =>
                ProductServices.loadRemainingStock(item.Product),
            ),
        )
        return basketsItems
    }
    static async addProductToBasket(userID, productID, quantity) {
        const existingBasket =
            await Database.getInstance().models.UserBasket.findOne({
                where: {
                    userId: userID,
                    productId: productID,
                },
            })
        if (existingBasket) {
            existingBasket.quantity = quantity
            await existingBasket.save()
        } else {
            await Database.getInstance().models.UserBasket.create({
                userId: userID,
                productId: productID,
                quantity: quantity,
            })
        }
    }

    static removeProductFromBasket(userID, productID, ...args) {
        return Database.getInstance().models.UserBasket.destroy(
            {
                where: {
                    userId: userID,
                    productId: productID,
                },
            },
            ...args,
        )
    }
}
