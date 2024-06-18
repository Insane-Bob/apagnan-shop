import { RefundsController } from '../../Http/Controllers/RefundsController.js'
import { RefundRequestProvider } from '../../Http/Providers/RefundRequestProvider.js'

/**
 * Auth routes
 * @param {Router} router
 */
export default function (router) {
    router
        .group('/api/refunds', function () {
            this.get('/', RefundsController, 'index')
            this.get('/:refund_request/', RefundsController, 'show')
            this.post('/:refund_request/approve', RefundsController, 'approve')
        })
        .provide(RefundRequestProvider)
}
