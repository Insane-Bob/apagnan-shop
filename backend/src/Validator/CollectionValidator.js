import { z } from 'zod'
import { Validator } from './Validator.js'

const collectionSchema = z.object({
    name: z.string().min(3, {
        message: 'Le nom de la collection doit faire au moins 3 caractères',
    }),
    description: z.string().min(10, {
        message:
            'La description de la collection doit faire au moins 10 caractères',
    }),
    published: z.boolean(),
    imageId: z
        .number({
            invalid_type_error: "L'image doit être valide.",
        })
        .int({
            message: "L'image doit être valide.",
        })
        .positive({
            message: "L'image doit être valide",
        }),
})

export class CollectionValidator extends Validator {
    constructor() {
        super(collectionSchema)
    }
}
