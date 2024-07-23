import { Validator } from './Validator.js'
import { z } from 'zod'
import { NotificationSubscriptionType } from '../Enums/NotificationSubscriptionType.js'

export class NewsletterValidator extends Validator {
    constructor(schema = NewsletterValidator.default()) {
        super(schema)
    }

    static default() {
        return z.object({
            email: z.string().email({
                message: "Votre email n'est pas au bon format",
            }),
        })
    }
}
