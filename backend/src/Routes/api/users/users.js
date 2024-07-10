import { UserProvider } from '../../../Http/Providers/UserProvider.js'
import { UserController } from '../../../Http/Controllers/UserController.js'
import { CustomerProvider } from '../../../Http/Providers/CustomerProvider.js'
import { basketRoute } from './basket.js'
import { AccessLinkMiddleware } from '../../../Http/Middlewares/AccessLinkMiddleware.js'
import { OrderController } from '../../../Http/Controllers/OrderController.js'
import { AddressController } from '../../../Http/Controllers/AddressController.js'

/**
 * Auth routes
 * @param {Router} router
 */
export default function (router) {
    router
        .group('/api/users', function () {
            this.get('/', UserController, 'index')
            this.get('/:user_resource', UserController, 'show')
            this.patch('/:user_resource', UserController, 'update')
            this.delete('/:user_resource', UserController, 'delete')

            this.post(
                '/:user_resource/reset-password',
                UserController,
                'resetPassword',
            ).middleware(AccessLinkMiddleware, 100)

            this.post(
                '/:user_resource/activate',
                UserController,
                'activateAccount',
            ).middleware(AccessLinkMiddleware, 100)

            this.post('/ask-reset-password', UserController, 'askResetPassword')

            this.group('/:user_resource', function () {
                basketRoute(this)
                this.get('/addresses', AddressController, 'index')
                this.get('/orders', OrderController, 'index')
            }).provide(CustomerProvider)
        })
        .provide(UserProvider)
}
