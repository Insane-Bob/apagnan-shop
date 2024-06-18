import { z } from 'zod';
import { Validator } from './Validator.js';

    
const registerSchema = z.object({
    firstname: z.string().min(1, { message: 'First name is required' }),
    lastname: z.string().min(1, { message: 'Last name is required' }),
    email: z.string().email({ message: 'Invalid email address' }),
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

export class RegisterValidator extends Validator{
    constructor() {
        console.log('Register Validator');
        super(registerSchema)
    }

    validate(registerSchema) {
        return super.validate(registerSchema);
    }
}
