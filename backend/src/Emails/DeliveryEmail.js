import { EmailTemplate } from '../Enums/EmailTemplate.js'
import { Email } from '../lib/EmailSender.js'

export class DeliveryEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.DELIVERY_INCOMING)
    }
}