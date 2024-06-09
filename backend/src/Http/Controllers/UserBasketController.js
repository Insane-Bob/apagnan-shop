import { Controller } from '../../Core/Controller.js'
import {
    BadRequestException,
    InternalError,
} from '../../Exceptions/HTTPException.js'
import { Database } from '../../Models/index.js'

export class UserBasketController extends Controller {
    user_resource /** @provide by UserProvider */
    async add() {
        this.can(UserBasketController.show, this.user_resource)

        const productId = this.req.params.get('productId', null)
        BadRequestException.abortIf(!productId, 'Product ID is required')
        const quantity = this.req.body.get('quantity', 1)
        BadRequestException.abortIf(!quantity, 'Quantity is required')

        try {
            await new Promise((resolve, reject) => {
                /**
                 * Check if the product is already in the basket
                 * If it is, update the quantity
                 * If it is not, create a new entry
                 */
                Database.getInstance()
                    .models.UserBasket.findOne({
                        where: {
                            userId: this.user_resource.id,
                            productId: productId,
                        },
                    })
                    .then(async (basket) => {
                        if (basket) {
                            basket.quantity = quantity
                            await basket.save()
                        } else {
                            await Database.getInstance().models.UserBasket.create(
                                {
                                    userId: this.user_resource.id,
                                    productId: productId,
                                    quantity: quantity,
                                },
                            )
                        }
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
            this.res.json({
                message: 'Product added to basket',
            })
        } catch (e) {
            console.error(e)
            InternalError.abort('Failed to add product to basket')
        }
    }

    async remove() {
        this.can(UserBasketController.show, this.user_resource)
        const productId = this.req.params.get('productId', null)
        BadRequestException.abortIf(!productId, 'Product ID is required')

        await Database.getInstance().models.UserBasket.destroy({
            where: {
                userId: this.user_resource.id,
                productId: productId,
            },
        })
    }
}
