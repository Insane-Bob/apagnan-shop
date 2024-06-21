import { z } from 'zod'
import { Validator } from './Validator.js'
import { BillingAddressPolicy } from '../Http/Policies/BillingAddressPolicy.js'

export class BillingAddressValidator extends Validator {
    constructor(schema = BillingAddressPolicy.create()) {
        super(schema)
    }

    static create() {
        return z.object({
            street: z.string().min(3),
            city: z.string().min(3),
            region: z.string().min(3),
            country: z.string().min(3),
            postalCode: z.string().min(5),
            customerId: z.number().int(),
        })
    }

    static update() {
        return z.object({
            street: z.string().min(3).optional(),
            city: z.string().min(3).optional(),
            region: z.string().min(3).optional(),
            country: z.string().min(3).optional(),
            postalCode: z.string().min(5).optional(),
        })
    }
}
