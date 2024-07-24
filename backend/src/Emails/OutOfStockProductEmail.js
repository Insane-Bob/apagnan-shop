import { Email } from '../lib/EmailSender.js'
import { EmailTemplate } from '../Enums/EmailTemplate.js'

export class OutOfStockProductEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.OUT_OF_STOCK)
    }
}
