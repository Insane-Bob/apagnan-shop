import { PaymentController } from '../../Http/Controllers/PaymentController.js'
import { AccessLinkMiddleware } from '../../Http/Middlewares/AccessLinkMiddleware.js'

/**
 * Auth routes
 * @param {Router} router
 */
export default function (router) {
    router.group('/api/payments', function () {
        this.get('/success', PaymentController, 'success').middleware(
            AccessLinkMiddleware,
            100,
        )
        this.get('/cancel', PaymentController, 'cancel').middleware(
            AccessLinkMiddleware,
            100,
        )
    })
}
