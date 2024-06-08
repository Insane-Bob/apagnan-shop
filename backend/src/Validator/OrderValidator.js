import { z } from 'zod'
import { Validator } from './Validator.js'

const schema = z.object({})

export class OrderValidator extends Validator {
    constructor() {
        super(schema)
    }
}
