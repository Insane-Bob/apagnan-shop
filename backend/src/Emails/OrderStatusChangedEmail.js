import { Email } from '../lib/EmailSender.js'
import { EmailTemplate } from '../Enums/EmailTemplate.js'

export class OrderStatusChangedEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.ORDER_STATUS_CHANGED)        
    }
}
