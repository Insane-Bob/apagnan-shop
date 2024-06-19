import { Email } from '../lib/EmailSender.js'

export class RegisterEmail extends Email{
    constructor(){
        super()
        this.setTemplate(1)
    }
}