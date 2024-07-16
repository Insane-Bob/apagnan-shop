import { AddressController } from '../../Http/Controllers/AddressController.js'
import { AddressProvider } from '../../Http/Providers/AddressProvider.js'

export default function (router) {
    router
        .group('/api/addresses', function () {
            this.get('/', AddressController, 'index')
            this.get('/:address', AddressController, 'show')
            this.post('/', AddressController, 'store')
            this.patch('/:address', AddressController, 'update')
            this.delete('/:address', AddressController, 'delete')
        })
        .provide(AddressProvider)
}
