import { Document } from '../Document.js'
import { SearchCustomerDocument } from './SearchCustomerDocument.js'

export class SearchUserDocument extends Document {
    static structure = {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        customer: null,
    }

    async patch() {
        this.id = this.modelInstance.id
        this.firstName = this.modelInstance.firstName
        this.lastName = this.modelInstance.lastName
        this.email = this.modelInstance.email
        this.customer = SearchCustomerDocument.loadFromInstance(
            await this.modelInstance.getCustomer(),
        )
    }
}
