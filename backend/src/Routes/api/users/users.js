import { UserProvider } from '../../../Http/Providers/UserProvider.js'
import { UserController } from '../../../Http/Controllers/UserController.js'
import { CustomerProvider } from '../../../Http/Providers/CustomerProvider.js'
import { ordersRoutes } from './orders.js'
import { billingAddressRoutes } from './billingAddress.js'
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
            this.put('/:user_resource', UserController, 'update')
            this.delete('/:user_resource', UserController, 'delete')

            this.group('/:user_resource', function () {
                basketRoute(this)
                billingAddressRoutes(this)
                ordersRoutes(this)
            }).provide(CustomerProvider)
        })
        .provide(UserProvider)
}
