import {Document} from "../core/Document.js";
import {BillingAddressesDocument} from "./BillingAddressesDocument.js";
import {OrderDocument} from "./OrderDocument.js";

export class CustomerDocument extends Document {
    static structure = {
        id: null,
        stripeId: null,
        billingAddresses: null,
        orders: null
    }

    async patch(){
        this.id = this.modelInstance.id
        this.stripeId = this.modelInstance.stripeId
        this.billingAddresses = BillingAddressesDocument.map(await this.modelInstance.getBillingAddresses())
        this.orders = OrderDocument.map(await this.modelInstance.getOrders())
    }
}