import { z } from 'zod'
import { Validator } from './Validator.js'

const schema = z
    .object({
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
        message: 'Passwords do not match',
        path: ['passwordConfirmation'],
    })

export class ResetPasswordValidator extends Validator {
    constructor() {
        super(schema)
    }
}
