import { EmailTemplate } from '../Enums/EmailTemplate.js'
import { Email } from '../lib/EmailSender.js'

export class ConnectionAttempt3FailedEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.BLOCKED_ACCOUNT)
    }
}
