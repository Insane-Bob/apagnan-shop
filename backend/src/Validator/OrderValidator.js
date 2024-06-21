import { z } from 'zod'
import { Validator } from './Validator.js'

export class OrderValidator extends Validator {
    constructor(schema = OrderValidator.create()) {
        super(schema)
    }

    static create() {
        return z.object({
            customerId: z.number().int().positive(),
        })
    }
    static update() {
        return z.object({})
    }
}
