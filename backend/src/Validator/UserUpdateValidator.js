import { z } from 'zod'
import { Validator } from './Validator.js'
import { USER_ROLES } from '../Models/user.js'

const schema = z.object({
    firstName: z
        .string()
        .min(2, { message: 'First name is required' })
        .optional(),
    lastName: z
        .string()
        .min(2, { message: 'Last name is required' })
        .optional(),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters long' })
        .optional(),
    email: z.string().email({ message: 'Invalid email' }).optional(),
    phone: z
        .string()
        .min(10, {
            message: 'Phone number must be at least 10 characters long',
        })
        .optional(),
    role: z
        .enum(Object.values(USER_ROLES), {
            message: 'Invalid role',
        })
        .optional(),
})

export class UserUpdateValidator extends Validator {
    constructor() {
        super(schema)
    }
}
