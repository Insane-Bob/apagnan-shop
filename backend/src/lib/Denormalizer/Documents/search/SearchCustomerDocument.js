import { Document } from '../Document.js'
import { SearchAddressesDocument } from './SearchAddressesDocument.js'
import { SearchOrderDocument } from './SearchOrderDocument.js'

export class SearchCustomerDocument extends Document {
    static structure = {
        id: null,
        stripeId: null,
        addresses: null,
        orders: null,
    }

    async patch() {
        this.id = this.modelInstance.id
        this.stripeId = this.modelInstance.stripeId
        this.addresses = SearchAddressesDocument.map(
            await this.modelInstance.getAddresses(),
        )
        this.orders = SearchOrderDocument.map(
            await this.modelInstance.getOrders(),
        )
    }
}
