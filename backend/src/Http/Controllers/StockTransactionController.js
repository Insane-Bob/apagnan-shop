import { Controller } from '../../Core/Controller.js'
import { StockService } from '../../Services/StockService.js'
import { ProductPolicy } from '../Policies/ProductPolicy.js'
import { StockTransactionValidator } from '../../Validator/StockTransactionValidator.js'

export class StockTransactionController extends Controller {
    async updateStock() {
        this.can(ProductPolicy.update)
        const payload = this.validate(StockTransactionValidator)
        const { productId, quantity } = payload
        if (this.req.route.path === '/add-stock') {
            await StockService.addStock(productId, quantity)
        } else {
            await StockService.removeStock(productId, quantity)
        }
        return this.res.sendStatus(200)
    }
}
