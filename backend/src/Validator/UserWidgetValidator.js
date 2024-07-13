import { Validator } from './Validator.js'
import { z } from 'zod'

export class UserWidgetValidator extends Validator {
    constructor() {
        super(UserWidgetValidator.put())
    }

    static put() {
        let jsonSchema = z.object({
            id: z.string(),
            active: z.boolean(),
            gs: z.object({
                x: z.number(),
                y: z.number(),
                width: z.number(),
                height: z.number().optional(),
            }),
        })

        return z.object({
            data: z.array(jsonSchema),
        })
    }
}
