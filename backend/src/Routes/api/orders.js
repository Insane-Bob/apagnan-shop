import { OrderProvider } from '../../Http/Providers/OrderProvider.js'
import { OrderController } from '../../Http/Controllers/OrderController.js'

export default function (router) {
    router
        .group('/api/orders', function () {
            this.get('/', OrderController, 'index')
            this.get('/:order', OrderController, 'show')
            this.post('/', OrderController, 'store')
            this.put('/:order', OrderController, 'update')
            this.post('/:order/pay', OrderController, 'pay')
            this.post('/:order/ask-for-refund', OrderController, 'askForRefund')
        })
        .provide(OrderProvider)
}
