import { z } from 'zod'
import { Validator } from './Validator.js'
import { USER_ROLES } from '../Models/SQL/user.js'

export class UserUpdateValidator extends Validator {
    constructor(schema = UserUpdateValidator.update()) {
        super(schema)
    }

    static updateAdmin() {
        return z.object({
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
                .min(12, {
                    message:
                        'Votre mot de passe doit faire au moins 12 caractères',
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
                    message:
                        'Votre mot de passe doit contenir au moins un chiffre',
                })
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
    }

    static update() {
        return z.object({
            firstName: z
                .string()
                .min(2, { message: 'Le Prénom est obligatoire' })
                .optional(),
            lastName: z
                .string()
                .min(2, { message: 'Le Nom est obligatoire' })
                .optional(),
            // password: z
            //     .string()
            //     .min(12, {
            //         message:
            //             'Votre mot de passe doit faire au moins 12 caractères',
            //     })
            //     .regex(/[a-z]/, {
            //         message:
            //             'Votre mot de passe doit contenir au moins une minuscule',
            //     })
            //     .regex(/[A-Z]/, {
            //         message:
            //             'Votre mot de passe doit contenir au moins une majuscule',
            //     })
            //     .regex(/[0-9]/, {
            //         message:
            //             'Votre mot de passe doit contenir au moins un chiffre',
            //     })
            //     .optional(),
            email: z
                .string()
                .email({ message: "Votre email n'est pas au bon format" })
                .optional(),
            phone: z
                .string()
                .regex(/^\d{10,}$/, {
                    message:
                        'Le numéro de téléphone doit comporter au moins 10 chiffres et uniquement des chiffres',
                })
                .optional(),
        })
    }
}
