import { ProductController } from '../../Http/Controllers/ProductController.js'
import { ReviewController } from '../../Http/Controllers/ReviewController.js'
import { SpecificController } from '../../Http/Controllers/SpecificController.js'
import { ProductProvider } from '../../Http/Providers/ProductProvider.js'

/**
 * Auth routes
 * @param {Router} router
 */

export default function (router) {
    router
        .group('/api/products', function () {
            this.get('/', ProductController, 'getProducts')
            this.get('/prices', ProductController, 'getPricesRange')
            this.get('/:product', ProductController, 'getProduct')
            this.post('/', ProductController, 'createProduct')
            this.patch('/:product', ProductController, 'updateProduct')
            this.delete('/:product', ProductController, 'deleteProduct')

            this.group('/:product', function () {
                this.get('/reviews', ReviewController, 'getReviews')
                this.get('/specifics', SpecificController, 'getSpecifics')
            })

            this.get('/:product/stock', ProductController, 'streamStock')
        })
        .provide(ProductProvider)
}
