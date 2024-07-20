import { z } from 'zod'
import { Validator } from './Validator.js'

const stockTransactionSchema = z.object({
    productId: z.number(),
    quantity: z.number().positive(),
})

export class StockTransactionValidator extends Validator {
    constructor() {
        super(stockTransactionSchema)
    }
}
