import { z } from 'zod'
import { Validator } from './Validator.js'

const loginSchema = z.object({
    email: z.string().email({ message: "Votre email n'est pas au bon format" }),
    password: z
        .string()
        .min(12, {
            message: 'Votre mot de passe doit faire au moins 12 caractères',
        })
        .regex(/[a-z]/, {
            message: 'Votre mot de passe doit contenir au moins une minuscule',
        })
        .regex(/[A-Z]/, {
            message: 'Votre mot de passe doit contenir au moins une majuscule',
        })
        .regex(/[0-9]/, {
            message: 'Votre mot de passe doit contenir au moins un chiffre',
        }),
})

export class LoginValidator extends Validator {
    constructor() {
        super(loginSchema)
    }
}
