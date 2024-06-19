import { Email } from '../lib/EmailSender.js'

export class ResetPasswordEmail extends Email {
    constructor() {
        super()
        this.setTemplate(2)
    }
}