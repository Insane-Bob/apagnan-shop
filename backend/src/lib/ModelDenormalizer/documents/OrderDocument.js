import {Document} from "../core/Document.js";

export class OrderDocument extends Document{
    static structure = {
        id: null,
        customerId: null,
    }

    async patch() {
        this.id = this.modelInstance.id
        this.customerId = this.modelInstance.customerId
    }
}