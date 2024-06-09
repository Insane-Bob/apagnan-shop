import { OrderProvider } from '../../../Http/Providers/OrderProvider.js'
import { OrderController } from '../../../Http/Controllers/OrderController.js'

export function ordersRoutes(customerRouterGroup) {
    customerRouterGroup
        .group('/orders', function () {
            this.get('/', OrderController, 'index')
            this.get('/:order', OrderController, 'show')
            this.post('/', OrderController, 'store')
            this.put('/:order', OrderController, 'update')
            this.delete('/:order', OrderController, 'delete')
        })
        .provide(OrderProvider)
}
