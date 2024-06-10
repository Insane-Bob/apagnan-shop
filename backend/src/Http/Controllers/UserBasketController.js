import { Controller } from '../../Core/Controller.js'
import {
    BadRequestException,
    InternalError,
} from '../../Exceptions/HTTPException.js'
import { UserBasketPolicy } from '../Policies/UserBasketPolicy.js'
import { UserBasketServices } from '../../Services/UserBasketServices.js'

export class UserBasketController extends Controller {
    user_resource /** @provide by UserProvider */
    async add() {
        this.can(UserBasketPolicy.update, this.user_resource)

        const productId = this.req.params.get('productId', null)
        BadRequestException.abortIf(!productId, 'Product ID is required')
        const quantity = this.req.body.get('quantity', 1)

        try {
            await UserBasketServices.addProductToBasket(
                this.user_resource.id,
                productId,
                quantity,
            )

            this.res.json({
                message: 'Product added to basket',
            })
        } catch (e) {
            console.error(e)
            InternalError.abort('Failed to add product to basket')
        }
    }

    async remove() {
        this.can(UserBasketPolicy.update, this.user_resource)
        const productId = this.req.params.get('productId', null)
        BadRequestException.abortIf(!productId, 'Product ID is required')

        try {
            await UserBasketServices.removeProductFromBasket(
                this.user_resource.id,
                productId,
            )

            this.res.json({
                message: 'Product removed from basket',
            })
        } catch (e) {
            console.error(e)
            InternalError.abort('Failed to remove product from basket')
        }
    }
}
