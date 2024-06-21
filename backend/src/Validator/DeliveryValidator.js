import { z } from 'zod'
import { Validator } from './Validator.js'

const schema = z.object({
    orderId: z.number(),
    deliveryId: z.string().min(10),
})

export class DeliveryValidator extends Validator {
    constructor() {
        super(schema)
    }
}
