import { Email } from '../lib/EmailSender.js'
import { EmailTemplate } from '../Enums/EmailTemplate.js'

export class SubscribeNewsletterEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.SUBSCRIBE_NEWSLETTER)
    }
}