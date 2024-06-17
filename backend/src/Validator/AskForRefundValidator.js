import { z } from 'zod'
import { Validator } from './Validator.js'

const schema = z.object({
    reason: z.string().min(5).max(255),
})

export class AskResetPasswordValidator extends Validator {
    constructor() {
        super(schema)
    }
}
