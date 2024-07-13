import { Validator } from '../Validator.js'
import { z } from 'zod'

export class PeriodValidator extends Validator {
    constructor() {
        super(PeriodValidator.schema())
    }

    beforeValidation(req) {
        if (req.query.has('start') && req.query.has('end')) {
            req.query.set('start', new Date(req.query.get('start')))
            req.query.set('end', new Date(req.query.get('end')))
        }
    }

    static schema() {
        return z.object({
            start: z.date(),
            end: z.date(),
        })
    }
}
