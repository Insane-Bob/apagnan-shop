import { z } from 'zod'
import { Validator } from './Validator.js'

const schema = z.object({
    password: z
        .string()
        .min(12, { message: 'Password must be at least 12 characters long' })
        .regex(/[a-z]/, {
            message: 'Password must contain at least one lowercase letter',
        })
        .regex(/[A-Z]/, {
            message: 'Password must contain at least one uppercase letter',
        })
        .regex(/[0-9]/, {
            message: 'Password must contain at least one number',
        }),
    passwordConfirmation: z.string(),
})

export class ResetPasswordValidator extends Validator {
    constructor() {
        super(schema)
    }
}
