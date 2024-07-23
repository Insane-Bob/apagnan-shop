import { z } from 'zod'
import { Validator } from './Validator.js'
import { PromoPolicy } from '../Http/Policies/PromoPolicy.js'

const translation = {
    code: {
        min: 'Le nom du code doit faire minimum 5 caractères',
    },
    value: {
        gt: 'Le valeur doit être au moins de 1',
    },
    type: {
        required: 'Le type de promo est obligatoire',
    },
}

export class PromoValidator extends Validator {
    constructor(schema = PromoPolicy.create()) {
        super(schema)
    }

    static create() {
        return z.object({
            code: z.string().min(5, { message: translation.code.min }),
            value: z.number().gt(0, { message: translation.value.gt }),
            type: z.string(),
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
