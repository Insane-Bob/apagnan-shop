import { Document } from '../core/Document.js'
import {CustomerDocument} from "./CustomerDocument.js";

export class UserDocument extends Document{
    static structure = {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        customer : null
    }

    async patch(){
        this.id = this.modelInstance.id
        this.firstName = this.modelInstance.firstName
        this.lastName = this.modelInstance.lastName
        this.email = this.modelInstance.email
        this.password = this.modelInstance.password
        this.customer = CustomerDocument.loadFromInstance(await this.modelInstance.getCustomer())
    }
}