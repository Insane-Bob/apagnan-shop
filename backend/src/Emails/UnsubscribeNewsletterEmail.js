import { Email } from '../lib/EmailSender.js'
import { EmailTemplate } from '../Enums/EmailTemplate.js'

export class UnsubscribeNewsletterEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.UNSUBSCRIBE_NEWSLETTER)
    }
}