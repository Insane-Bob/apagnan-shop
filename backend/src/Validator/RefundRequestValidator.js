import { Validator } from './Validator.js'
import { z } from 'zod'

export class RefundRequestValidator extends Validator {
    constructor(schema) {
        super(schema)
    }

    beforeValidation(req) {
        if (req.query.has('customersIds')) {
            req.query.set(
                'customersIds',
                req.query.get('customersIds').split(','),
            )
        }

        if (req.query.has('approved')) {
            req.query.set('approved', req.query.get('approved').split(','))
        }
    }

    static index() {
        return z.object({
            approved: z.array(z.number().or(z.string())).optional(),
            orderId: z.number().optional(),
            customersIds: z.array(z.number().or(z.string())).optional(),
        })
    }
}
