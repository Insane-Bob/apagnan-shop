import {Document} from "../Document.js";

export class SearchOrderDocument extends Document{
    static structure = {
        id: null,
        customerId: null,
    }

    async patch() {
        this.id = this.modelInstance.id
    }
}