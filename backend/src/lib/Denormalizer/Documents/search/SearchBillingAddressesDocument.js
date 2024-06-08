import {Document} from "../Document.js";

export class SearchBillingAddressesDocument extends Document {
    static structure = {
        id:null,
        street:null,
        city:null,
        region:null,
        country:null,
        postalCode:null
    }

    async patch(){
        this.id = this.modelInstance.id
        this.street = this.modelInstance.street
        this.city = this.modelInstance.city
        this.country = this.modelInstance.country
        this.region = this.modelInstance.region
        this.postalCode = this.modelInstance.postalCode
    }
}