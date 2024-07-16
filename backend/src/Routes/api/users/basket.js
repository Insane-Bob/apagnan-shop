import { UserBasketController } from '../../../Http/Controllers/UserBasketController.js'

export function basketRoute(userRouteGroup) {
    userRouteGroup.group('/basket', function () {
        this.get('/', UserBasketController, 'show')
        this.put('/:productId', UserBasketController, 'put')
        this.delete('/:productId', UserBasketController, 'delete')
    })
}
