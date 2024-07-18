import { PromoController } from '../../Http/Controllers/PromoController.js'
import {
    PromoProvider,
    PromoCodeProvider,
} from '../../Http/Providers/PromoProvider.js'

/**
 * Auth routes
 * @param {Router} router
 */

export default function (router) {
    router
        .group('/api/promos', function () {
            this.get('/', PromoController, 'index')
            this.get('/promoted', PromoController, 'getPromoted')
            this.post('/', PromoController, 'create')
            this.patch('/:promo', PromoController, 'update')
            this.delete('/:promo', PromoController, 'delete')
        })
        .provide(PromoProvider)

    router
        .group('/api/promo-codes', function () {
            this.get('/:code', PromoController, 'show')
        })
        .provide(PromoCodeProvider)
}
