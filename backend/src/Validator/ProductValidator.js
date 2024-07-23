import { z } from 'zod'
import { Validator } from './Validator.js'

const productSchema = z.object({
    name: z.string().min(3, {
        message: 'Le nom du produit doit faire au moins 3 caractères',
    }),
    description: z.string().min(10, {
        message: 'La description du produit doit faire au moins 10 caractères',
    }),
    price: z.number().min(1, {
        message: 'Le prix du produit doit être supérieur à 0',
    }),
    published: z.boolean(),
    collectionId: z.number(),
    imagesIds: z.array(z.number()),
})

export class ProductValidator extends Validator {
    constructor() {
        super(productSchema)
    }
}
