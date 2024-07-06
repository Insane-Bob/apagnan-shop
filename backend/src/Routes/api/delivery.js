import { DeliveryProvider } from '../../Http/Providers/DeliveryProvider.js'
import { DeliveryController } from '../../Http/Controllers/DeliveryController.js'

/**
 * Auth routes
 * @param {Router} router
 */
export default function (router) {
    router
        .group('/api/delivery', function () {
            this.get('/:delivery', DeliveryController, 'show')
            this.post('/', DeliveryController, 'create')
        })
        .provide(DeliveryProvider)
}
