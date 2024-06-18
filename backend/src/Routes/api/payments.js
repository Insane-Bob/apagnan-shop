import { PaymentController } from '../../Http/Controllers/PaymentController.js'

/**
 * Auth routes
 * @param {Router} router
 */
export default function (router) {
    router.group('/api/payments', function () {
        this.get('/success', PaymentController, 'success')
        this.get('/cancel', PaymentController, 'cancel')
    })
}
