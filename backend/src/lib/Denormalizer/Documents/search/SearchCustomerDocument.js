import { Document } from '../Document.js'
import { SearchBillingAddressesDocument } from './SearchBillingAddressesDocument.js'
import { SearchOrderDocument } from './SearchOrderDocument.js'

export class SearchCustomerDocument extends Document {
    static structure = {
        id: null,
        stripeId: null,
        billingAddresses: null,
        orders: null,
    }

    async patch() {
        this.id = this.modelInstance.id
        this.stripeId = this.modelInstance.stripeId
        this.billingAddresses = SearchBillingAddressesDocument.map(
            await this.modelInstance.getBillingAddresses(),
        )
        this.orders = SearchOrderDocument.map(
            await this.modelInstance.getOrders(),
        )
    }
}
