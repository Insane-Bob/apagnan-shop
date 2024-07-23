import { z } from 'zod'
import { Validator } from './Validator.js'
import { AddressPolicy } from '../Http/Policies/AddressPolicy.js'

const translation = {
    street: {
        min: 'Le nom de la rue doit contenir au moins 3 caractères',
    },
    city: {
        min: 'Le nom de la ville doit contenir au moins 3 caractères',
    },
    region: {
        min: 'Le nom de la région doit contenir au moins 3 caractères',
    },
    country: {
        min: 'Le nom du pays doit contenir au moins 3 caractères',
    },
    postalCode: {
        min: 'Le code postale doit contenir au moins 5 caractères',
    },
    customerId: {
        int: 'Le champ ID doit être un chiffre entier',
    },
}

export class AddressValidator extends Validator {
    constructor(schema = AddressPolicy.create()) {
        super(schema)
    }

    static create() {
        return z.object({
            street: z.string().min(3, {
                message: translation.street.min,
            }),
            city: z.string().min(3, {
                message: translation.city.min,
            }),
            region: z.string().min(3, {
                message: translation.region.min,
            }),
            country: z.string().min(3, {
                message: translation.country.min,
            }),
            postalCode: z.string().min(5, {
                message: translation.postalCode.min,
            }),
            customerId: z.number().int({
                message: translation.customerId.int,
            }),
        })
    }

    static update() {
        return z.object({
            street: z.string().min(3, {
                message: translation.street.min,
            }),
            city: z.string().min(3, {
                message: translation.city.min,
            }),
            region: z.string().min(3, {
                message: translation.region.min,
            }),
            country: z.string().min(3, {
                message: translation.country.min,
            }),
            postalCode: z.string().min(5, {
                message: translation.postalCode.min,
            }),
            customerId: z.number().int({
                message: translation.customerId.int,
            }),
        })
    }
}
