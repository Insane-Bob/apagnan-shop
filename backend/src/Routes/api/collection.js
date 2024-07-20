import { CollectionController } from '../../Http/Controllers/CollectionController.js'
import { ProductController } from '../../Http/Controllers/ProductController.js'
import { CollectionProvider } from '../../Http/Providers/CollectionProvider.js'

/**
 * Auth routes
 * @param {Router} router
 */

export default function (router) {
    router
        .group('/api/collections', function () {
            this.get('/', CollectionController, 'getCollections')
            this.get('/promoted', CollectionController, 'getPromotedCollection')
            this.get('/:collection', CollectionController, 'getCollection')
            this.post('/', CollectionController, 'createCollection')
            this.patch('/:collection', CollectionController, 'updateCollection')
            this.delete(
                '/:collection',
                CollectionController,
                'deleteCollection',
            )

            this.group('/:collection', function () {
                this.get('/products', ProductController, 'getProducts')
            })
        })
        .provide(CollectionProvider)
}
