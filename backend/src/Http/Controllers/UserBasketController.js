import { Controller } from '../../Core/Controller.js'
import {
    BadRequestException,
    ForbiddenException,
    HTTPException,
    InternalError,
} from '../../Exceptions/HTTPException.js'
import { UserBasketPolicy } from '../Policies/UserBasketPolicy.js'
import { UserBasketServices } from '../../Services/UserBasketServices.js'
import { Database } from '../../Models/index.js'
import { ProductServices } from '../../Services/ProductServices.js'

export class UserBasketController extends Controller {
    user_resource /** @provide by UserProvider */

    async show() {
        this.can(UserBasketPolicy.show, this.user_resource)
        try {
            const basket = await UserBasketServices.getUserBasket(
                this.user_resource.id,
            )
            this.res.json(basket)
        } catch (e) {
            console.error(e)
            InternalError.abort('Failed to fetch user basket')
        }
    }
    async put() {
        this.can(UserBasketPolicy.show, this.user_resource)

        const productId = this.req.params.get('productId', null)
        BadRequestException.abortIf(!productId, 'Product ID is required')
        const product =
            await Database.getInstance().models.Product.findByPk(productId)
        BadRequestException.abortIf(!product, 'Product not found')

        const quantity = this.req.body.get('quantity', 1)

        try {
            await UserBasketServices.removeProductFromBasket(
                this.user_resource.id,
                productId,
            )
            await ProductServices.loadRemainingStock(product)
            ForbiddenException.abortIf(
                product.remainingStock < quantity,
                'Not enough stock',
            )

            await UserBasketServices.addProductToBasket(
                this.user_resource.id,
                productId,
                quantity,
            )

            this.res.json({
                message: 'Product added to basket',
            })
        } catch (e) {
            if (e instanceof HTTPException) throw e
            console.error(e)
            InternalError.abort('Failed to add product to basket')
        }
    }

    async delete() {
        this.can(UserBasketPolicy.show, this.user_resource)
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
