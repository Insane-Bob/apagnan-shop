import { StockTransactionController } from '../../Http/Controllers/StockTransactionController.js'

/**
 * Stock routes
 * @param {Router} router
 */

export default function (router) {
    router.group('/api/stocks', function () {
        this.post('/add-stock', StockTransactionController, 'updateStock')
        this.post('/remove-stock', StockTransactionController, 'updateStock')
    })
}
