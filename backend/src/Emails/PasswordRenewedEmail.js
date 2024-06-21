import { Email } from '../lib/EmailSender.js'
import { EmailTemplate } from '../Enums/EmailTemplate.js'

export class PasswordRenewedEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.PASSWORD_RENEWED)
    }
}