import { EmailTemplate } from '../Enums/EmailTemplate.js'
import { Email } from '../lib/EmailSender.js'

export class NewProductEmail extends Email {
    constructor() {
        super()
        this.setTemplate(EmailTemplate.NEW_PRODUCT)
    }
}