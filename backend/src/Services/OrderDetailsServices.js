import { Database } from '../Models/index.js'
import {
    ForbiddenException,
    NotFoundException,
} from '../Exceptions/HTTPException.js'
import { ProductServices } from './ProductServices.js'
export class OrderDetailsServices {
    /**
     * Check if the product has enough stock to be added to the order
     * and remove the quantity of the user basket (selfQuantity) from the product stock to ignore it
     *
     * @param orderId
     * @param productId
     * @param quantity
     * @param selfQuantity
     * @returns {Promise<{unitPrice, quantity, productId, orderId}>}
     */
    static async parseOrderLine(orderId, productId, quantity, selfQuantity) {
        const product =
            await Database.getInstance().models.Product.findByPk(productId)
        NotFoundException.abortIf(!product, 'Product not found')

        await ProductServices.loadRemainingStock(product)
        ForbiddenException.abortIf(
            product.stock + -1 * selfQuantity < quantity,
            'Not enough stock',
        )

        return {
            orderId,
            productId,
            quantity,
            unitPrice: product.price,
        }
    }
}
