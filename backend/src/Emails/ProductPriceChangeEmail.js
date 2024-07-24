import { Email } from '../lib/EmailSender.js'
import { EmailTemplate } from '../Enums/EmailTemplate.js'

export class ProductPriceChangeEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.PRODUCT_PRICE_CHANGE)
    }
}