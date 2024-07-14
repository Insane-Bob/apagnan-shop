import { z } from 'zod'
import { Validator } from './Validator.js'

const reviewSchema = z.object({
    rate: z.number().int().min(1).max(5, {
        message: 'La note doit être comprise entre 1 et 5',
    }),
    content: z.string().min(3, {
        message: 'Le contenu de la review doit faire au moins 3 caractères',
    }),
    productId: z.number(),
    userId: z.number(),
})

export class ReviewValidator extends Validator {
    constructor() {
        super(reviewSchema)
    }
}
