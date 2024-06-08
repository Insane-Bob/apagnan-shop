import { BillingAddressController } from '../../../Http/Controllers/BillingAddressController.js'
import { BillingAddressProvider } from '../../../Http/Providers/BillingAddressProvider.js'

export function billingAddressRoutes(customerRouterGroup) {
    customerRouterGroup
        .group('/addresses', function () {
            this.get('/', BillingAddressController, 'index')
            this.get('/:billing_address', BillingAddressController, 'show')
            this.post('/', BillingAddressController, 'store')
            this.put('/:billing_address', BillingAddressController, 'update')
            this.delete('/:billing_address', BillingAddressController, 'delete')
        })
        .provide(BillingAddressProvider)
}
