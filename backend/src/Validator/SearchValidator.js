import { Validator } from './Validator.js'
import { z } from 'zod'

export class SearchValidator extends Validator {
    constructor() {
        super(SearchValidator.schema())
    }
    static schema() {
        return z.object({
            s: z.string(),
        })
    }
}
