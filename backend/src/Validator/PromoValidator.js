import { z } from 'zod'
import { Validator } from './Validator.js'
import { PromoPolicy } from '../Http/Policies/PromoPolicy.js'

export class PromoValidator extends Validator {
    constructor(schema = PromoPolicy.create()) {
        super(schema)
    }

    static create() {
        return z.object({
            type: z.string(),
            value: z.number(),
            code: z.string(),
            available: z.boolean().optional(),
            promoted: z.boolean().optional(),
            stripeId: z.string().optional(),
        })
    }

    static update() {
        return z.object({
            available: z.boolean().optional(),
            promoted: z.boolean().optional(),
        })
    }
}