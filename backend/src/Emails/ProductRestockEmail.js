import { EmailTemplate } from '../Enums/EmailTemplate.js'
import { Email } from '../lib/EmailSender.js'

export class ProductRestockEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.PRODUCT_RESTOCK)
    }
}   