import { z } from 'zod'
import { Validator } from './Validator.js'
import { OrderStatus } from '../Enums/OrderStatus.js'

export class OrderValidator extends Validator {
    constructor(schema = OrderValidator.create()) {
        super(schema)
    }

    static create() {
        return z.object({
            customerId: z.number().int().positive(),
            shippingAddressId: z.number().int().positive(),
            billingAddressId: z.number().int().positive(),
            products: z.array(
                z.object({
                    productId: z.number().int().positive(),
                    quantity: z.number().int().positive(),
                }),
            ),
        })
    }
    static update() {
        return z.object({
            status: z.enum([
                OrderStatus.PENDING,
                OrderStatus.PAID,
                OrderStatus.PROCESSING,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED,
                OrderStatus.REFUNDED,
                OrderStatus.CANCELLED,
            ]),
        })
    }

    beforeValidation(req) {
        if (req.query.has('status')) {
            req.query.set('status', req.query.get('status').split(','))
        }

        if(req.query.has('withProducts')) {
            req.query.set('withProducts', req.query.get('withProducts') === 'true')
        }
    }

    static index() {
        return z.object({
            status: z
                .array(
                    z.enum([
                        OrderStatus.PENDING,
                        OrderStatus.DELIVERED,
                        OrderStatus.REFUNDED,
                        OrderStatus.SHIPPED,
                        OrderStatus.CANCELLED,
                    ]),
                )
                .optional(),
            withProducts: z.boolean().optional(),
            customerId: z.number().optional(),
        })
    }
}
