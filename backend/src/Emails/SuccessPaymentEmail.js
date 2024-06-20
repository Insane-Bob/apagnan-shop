import { Email } from '../lib/EmailSender.js'

export class SuccessPaymentEmail extends Email {
    constructor() {
        super()
        this.setTemplate(5)
    }
}