import { Email } from '../lib/EmailSender.js'

export class FailedPaymentEmail extends Email {
    constructor() {
        super()
        this.setTemplate(6)
    }
}