import { BillingAddressController } from '../../../Http/Controllers/BillingAddressController.js'
import { OrderController } from '../../../Http/Controllers/OrderController.js'
import { UserController } from '../../../Http/Controllers/UserController.js'
import { AccessLinkMiddleware } from '../../../Http/Middlewares/AccessLinkMiddleware.js'
import { CustomerProvider } from '../../../Http/Providers/CustomerProvider.js'
import { UserProvider } from '../../../Http/Providers/UserProvider.js'
import { basketRoute } from './basket.js'

/**
 * Auth routes
 * @param {Router} router
 */
export default function (router) {
    router
        .group('/api/users', function () {
            this.get('/', UserController, 'index')
            this.get('/:user_resource', UserController, 'show')
            this.delete('/:user_resource', UserController, 'delete')
            this.patch('/:user_resource', UserController, 'update')
                .middleware(AccessLinkMiddleware, 100)

            this.get(
                '/:user_resource/activate',
                UserController,
                'activateAccount',
            ).middleware(AccessLinkMiddleware, 100)


            this.post('/ask-reset-password', UserController, 'askResetPassword')

            this.group('/:user_resource', function () {
                basketRoute(this)
                this.get('/addresses', BillingAddressController, 'index')
                this.get('/orders', OrderController, 'index')
            }).provide(CustomerProvider)
        })
        .provide(UserProvider)
}
