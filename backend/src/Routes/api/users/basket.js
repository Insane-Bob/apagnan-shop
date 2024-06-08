import { UserBasketController } from '../../../Http/Controllers/UserBasketController.js'

export function basketRoute(userRouteGroup) {
    userRouteGroup.group('/basket', function () {
        this.post('/add/:productId', UserBasketController, 'add')
        this.post('/remove/:productId', UserBasketController, 'remove')
    })
}
