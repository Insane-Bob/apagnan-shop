import { z } from 'zod'
import { Validator } from './Validator.js'

const specificSchema = z.object({
    name: z.string().min(3, {
        message: 'Le nom du spécifique doit faire au moins 3 caractères',
    }),
    content: z.string().min(3, {
        message: 'Le contenu du spécifique doit faire au moins 10 caractères',
    }),
    productId: z.number(),
})

export class SpecificValidator extends Validator {
    constructor() {
        super(specificSchema)
    }
}
