import { z } from 'zod'
import { Validator } from './Validator.js'

const schema = z.object({
    email: z.string().email(),
})

export class AskResetPasswordValidator extends Validator {
    constructor() {
        super(schema)
    }
}
