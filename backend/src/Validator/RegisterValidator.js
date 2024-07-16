import { z } from 'zod'
import { Validator } from './Validator.js'

const registerSchema = z
    .object({
        firstName: z.string().min(1, { message: 'Le nom est obligatoire' }),
        lastName: z.string().min(1, { message: 'Le prénom est obligatoire' }),
        email: z
            .string()
            .email({ message: "Votre email n'est pas au bon format" }),
        password: z
            .string()
            .min(12, {
                message: 'Votre mot de passe doit faire au moins 12 caractères',
            })
            .regex(/[a-z]/, {
                message:
                    'Votre mot de passe doit contenir au moins une minuscule',
            })
            .regex(/[A-Z]/, {
                message:
                    'Votre mot de passe doit contenir au moins une majuscule',
            })
            .regex(/[0-9]/, {
                message: 'Votre mot de passe doit contenir au moins un chiffre',
            }),
        passwordConfirmation: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['passwordConfirmation'],
    })

export class RegisterValidator extends Validator {
    constructor() {
        super(registerSchema)
    }

    validate(registerSchema) {
        return super.validate(registerSchema)
    }
}
