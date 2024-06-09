import { ProductController } from '../../Http/Controllers/ProductController.js'
import { ProductProvider } from '../../Http/Providers/ProductProvider.js'
import upload from '../../Http/Middlewares/multer.js'

/**
 * Auth routes
 * @param {Router} router
 */

export function productRoute(router) {
    router
        .group('/products', function () {
            this.get('/', ProductController, 'getProducts')
            this.get('/:product', ProductController, 'getProduct')
            this.post(
                '/',
                upload.array('productImages'),
                ProductController,
                'createProduct',
            )
            this.put(
                '/:product',
                upload.array('productImages'),
                ProductController,
                'updateProduct',
            )
            this.delete('/:product', ProductController, 'deleteProduct')
        })
        .provide(ProductProvider)
}
