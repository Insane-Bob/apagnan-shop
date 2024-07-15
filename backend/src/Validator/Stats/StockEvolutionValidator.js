import { Validator } from '../Validator.js'
import { z } from 'zod'

export class StockEvolutionValidator extends Validator {
    constructor() {
        super(StockEvolutionValidator.schema())
    }

    static schema() {
        return z.object({
            productId: z.string(),
        })
    }
}
