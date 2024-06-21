import { BillingAddressController } from '../../Http/Controllers/BillingAddressController.js'
import { BillingAddressProvider } from '../../Http/Providers/BillingAddressProvider.js'

export default function (router) {
    router
        .group('/api/addresses', function () {
            this.get('/', BillingAddressController, 'index')
            this.get('/:billing_address', BillingAddressController, 'show')
            this.post('/', BillingAddressController, 'store')
            this.patch('/:billing_address', BillingAddressController, 'update')
            this.delete('/:billing_address', BillingAddressController, 'delete')
        })
        .provide(BillingAddressProvider)
}
