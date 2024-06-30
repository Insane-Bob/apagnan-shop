import { EmailTemplate } from '../Enums/EmailTemplate.js'
import { Email } from '../lib/EmailSender.js'

export class FailedPaymentEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.PAYMENT_ERROR)
    }
}