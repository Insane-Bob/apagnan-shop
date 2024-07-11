import { EmailTemplate } from '../Enums/EmailTemplate.js'
import { Email } from '../lib/EmailSender.js'

export class ConfirmResetPasswordEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.CONFIRM_RESET_PASSWORD)
    }
}   