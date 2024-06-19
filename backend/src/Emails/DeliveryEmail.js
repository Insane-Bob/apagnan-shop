import { Email } from '../lib/EmailSender.js'

export class DeliveryEmail extends Email {
    constructor() {
        super()
        this.setTemplate(7)
    }
}