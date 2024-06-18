import { ProductController } from '../../Http/Controllers/ProductController.js'
import { ProductProvider } from '../../Http/Providers/ProductProvider.js'
import { specificRoutes } from './specific.js'
import { SpecificProvider } from '../../Http/Providers/SpecificProvider.js'
import { reviewRoutes } from './review.js'
import { ReviewProvider } from '../../Http/Providers/ReviewProvider.js'

/**
 * Auth routes
 * @param {Router} router
 */

export function productRoutes(router) {
    router
        .group('/products', function () {
            this.get('/', ProductController, 'getProducts')
            this.get('/:product', ProductController, 'getProduct')
            this.post('/', ProductController, 'createProduct')
            this.put('/:product', ProductController, 'updateProduct')
            this.delete('/:product', ProductController, 'deleteProduct')

            this.group('/:product', function () {
                specificRoutes(this)
            }).provide(SpecificProvider)

            this.group('/:product', function () {
                reviewRoutes(this)
            }).provide(ReviewProvider)
        })
        .provide(ProductProvider)
}
