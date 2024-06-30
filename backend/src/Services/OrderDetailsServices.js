import { Database } from '../Models/index.js'
import {
    ForbiddenException,
    NotFoundException,
} from '../Exceptions/HTTPException.js'
import { ProductServices } from './ProductServices.js'
export class OrderDetailsServices {
    static async parseOrderLine(orderId, productId, quantity, transaction) {
        const product =
            await Database.getInstance().models.Product.findByPk(productId)
        NotFoundException.abortIf(!product, 'Product not found')

        await ProductServices.loadRemainingStock(product)
        ForbiddenException.abortIf(
            product.remainingStock + quantity < quantity,
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
