import { Controller } from '../../Core/Controller.js'
import { StockService } from '../../Services/StockService.js'
import { ProductPolicy } from '../Policies/ProductPolicy.js'
import { StockTransactionValidator } from '../../Validator/StockTransactionValidator.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'
import { Database } from '../../Models/index.js'
import { ProductServices } from '../../Services/ProductServices.js'

export class StockTransactionController extends Controller {
    async updateStock() {
        this.can(ProductPolicy.updateStock)
        const payload = this.validate(StockTransactionValidator)
        const { productId, quantity } = payload
        if (this.req.route.path === '/add-stock') {
            await StockService.addStock(productId, quantity)

            const product =
                await Database.getInstance().models.Product.findByPk(productId)
            await ProductServices.loadRemainingStock(product)
            await NotificationsServices.notifyProductRestock(product)
        } else {
            await StockService.removeStock(productId, quantity)
        }
        return this.res.sendStatus(200)
    }
}
