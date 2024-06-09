import { CollectionController } from '../../Http/Controllers/CollectionController.js'
import { CollectionProvider } from '../../Http/Providers/CollectionProvider.js'
import { productRoute } from './product.js'
import upload from '../../Http/Middlewares/multer.js'

/**
 * Auth routes
 * @param {Router} router
 */

export default function (router) {
    router
        .group('/api/collections', function () {
            this.get('/', CollectionController, 'getCollections')
            this.get('/:collection', CollectionController, 'getCollection')
            this.post(
                '/',
                upload.single('collectionImage'),
                CollectionController,
                'createCollection',
            )
            this.put(
                '/:collection',
                upload.single('collectionImage'),
                CollectionController,
                'updateCollection',
            )
            this.delete(
                '/:collection',
                CollectionController,
                'deleteCollection',
            )
            productRoute(this)
        })
        .provide(CollectionProvider)
}
