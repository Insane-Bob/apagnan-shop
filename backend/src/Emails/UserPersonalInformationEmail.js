import { EmailTemplate } from '../Enums/EmailTemplate.js'
import { Email } from '../lib/EmailSender.js'

export class UserPersonalInformationEmail extends Email {
    constructor() {
        super()
        this.setTemplate(
            EmailTemplate.USER_PERSONAL_INFORMATION,
        )
    }
}
