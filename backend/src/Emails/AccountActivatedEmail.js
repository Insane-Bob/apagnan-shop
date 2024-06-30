import { Email } from '../lib/EmailSender.js'
import { EmailTemplate } from '../Enums/EmailTemplate.js'

export class AccountActivatedEmail extends Email {
    constructor() {
        super()
        this.templateId(EmailTemplate.ACCOUNT_ACTIVATED)
    }
}