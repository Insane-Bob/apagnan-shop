import { z } from 'zod'
import { Validator } from './Validator.js'

const loginSchema = z.object({
    email: z.string().email(),
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
})

export class LoginValidator extends Validator {
    constructor() {
        super(loginSchema)
    }
}
