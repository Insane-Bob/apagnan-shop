import { Validator } from '../Validator.js'
import { z } from 'zod'

export class IntervalValidator extends Validator {
    constructor() {
        super(IntervalValidator.schema())
    }

    static schema() {
        return z.object({
            interval: z.enum(['day', 'week', 'month', 'year']),
        })
    }
}
