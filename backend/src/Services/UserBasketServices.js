import { Database } from '../Models/index.js'

export class UserBasketServices {
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

    static removeProductFromBasket(userID, productID) {
        return Database.getInstance().models.UserBasket.destroy({
            where: {
                userId: userID,
                productId: productID,
            },
        })
    }
}
