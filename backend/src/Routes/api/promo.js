import { PromoController } from '../../Http/Controllers/PromoController.js'
import { PromoProvider } from '../../Http/Providers/PromoProvider.js'

/**
 * Auth routes
 * @param {Router} router
 */

export default function (router) {
    router
        .group('/api/promos', function () {
            this.get('/', PromoController, 'index')
            // this.get('/:promo', PromoController, 'getPromo')
            this.post('/', PromoController, 'create')
            this.patch('/:promo', PromoController, 'update')
            this.delete('/:promo', PromoController, 'delete')

            this.get('/promoted', PromoController, 'getPromoted')
        })
        .provide(PromoProvider)
}
