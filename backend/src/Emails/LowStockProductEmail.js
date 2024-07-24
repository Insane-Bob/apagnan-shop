import { EmailTemplate } from '../Enums/EmailTemplate.js'
import { Email } from '../lib/EmailSender.js'

export class LowStockProductEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.LOW_STOCK)
    }
}