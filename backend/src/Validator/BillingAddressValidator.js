import { z } from 'zod'
import { Validator } from './Validator.js'
import { USER_ROLES } from '../Models/user.js'

const schema = z.object({
    street: z.string().min(3),
    city: z.string().min(3),
    region: z.string().min(3),
    country: z.string().min(3),
    postalCode: z.string().min(5),
})

export class BillingAddressValidator extends Validator {
    constructor() {
        super(schema)
    }
}
