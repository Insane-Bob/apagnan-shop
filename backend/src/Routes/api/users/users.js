import { OrderController } from '../../../Http/Controllers/OrderController.js'
import { UserController } from '../../../Http/Controllers/UserController.js'
import { AccessLinkMiddleware } from '../../../Http/Middlewares/AccessLinkMiddleware.js'
import { CustomerProvider } from '../../../Http/Providers/CustomerProvider.js'
import { UserProvider } from '../../../Http/Providers/UserProvider.js'
import { basketRoute } from './basket.js'
import { AddressController } from '../../../Http/Controllers/AddressController.js'
import { widgetRoute } from './widget.js'
import { notificationsRoutes } from './notifications.js'

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
            this.patch('/:user_resource', UserController, 'update').middleware(
                AccessLinkMiddleware,
                100,
            )

            this.post(
                '/:user_resource/ask-personal-data',
                UserController,
                'askPersonalData',
            )

            this.post(
                '/:user_resource/reset-password',
                UserController,
                'resetPassword',
            ).middleware(AccessLinkMiddleware, 100)

            this.get(
                '/:user_resource/activate',
                UserController,
                'activateAccount',
            ).middleware(AccessLinkMiddleware, 100)

            this.post('/ask-reset-password', UserController, 'askResetPassword')

            this.post(
                '/ask-login-as/:user_resource',
                UserController,
                'askLoginAs',
            )

            this.group('/:user_resource', function () {
                notificationsRoutes(this)
                widgetRoute(this)
                basketRoute(this)
            })

            this.group('/:user_resource', function () {
                this.get('/addresses', AddressController, 'index')
                this.get('/orders', OrderController, 'index')
            }).provide(CustomerProvider)
        })
        .provide(UserProvider)
}
