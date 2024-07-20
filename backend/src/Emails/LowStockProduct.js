import { Email } from '../lib/EmailSender.js'
import { EmailTemplate } from '../Enums/EmailTemplate.js'

export class LowStockProduct extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.LOW_STOCK)
    }
}
