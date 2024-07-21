import { EmailTemplate } from '../Enums/EmailTemplate.js'
import { Email } from '../lib/EmailSender.js'

export class OrderSupportedEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.ORDER_SUPPORTED)
    }
}