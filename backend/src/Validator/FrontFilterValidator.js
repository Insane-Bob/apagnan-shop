import { z } from 'zod'
import { Validator } from './Validator.js'

export class FrontFilterValidator extends Validator {
    constructor() {
        super(FrontFilterValidator.schema())
    }

    beforeValidation(req) {
        if (req.query.has('color')) {
            req.query.set('color', req.query.get('color').split(','))
        }

        if (req.query.has('collection')) {
            req.query.set('collection', req.query.get('collection').split(','))
        }
        if (req.query.has('priceMin')) {
            req.query.set('priceMin', parseInt(req.query.get('priceMin')))
        }
        if (req.query.has('priceMax')) {
            req.query.set('priceMax', parseInt(req.query.get('priceMax')))
        }
    }

    static schema() {
        return z.object({
            s: z.string().optional(),
            priceMin: z.number().int().optional(),
            priceMax: z.number().int().optional(),
            color: z.array(z.string()).optional(),
            collection: z.array(z.string()).optional(),
        })
    }
}
