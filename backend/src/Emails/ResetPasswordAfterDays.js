import { Email } from '../lib/EmailSender.js'
import { EmailTemplate } from '../Enums/EmailTemplate.js'

export class ResetPasswordAfterDays extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.FORGOT_PASSWORD)        
    }
}