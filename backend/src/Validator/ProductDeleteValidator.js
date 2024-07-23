import { z } from 'zod'
import { Validator } from './Validator.js'
import request from 'supertest'

const schema = z.object({
    ids: z.array(z.number()),
})

export class ProductDeleteValidator extends Validator {
    beforeValidation(request) {
        if (request.query.has('ids')) {
            request.query.set(
                'ids',
                request.query.get('ids').split(',').map(Number),
            )
        }
    }

    constructor() {
        super(schema)
    }
}
