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
            promoId: z.number().int().optional(),
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
                OrderStatus.PROCESSING,
                OrderStatus.SHIPPED,
                OrderStatus.DELIVERED,
                OrderStatus.REFUNDED,
                OrderStatus.CANCELLED,
            ]),
            reason: z.string().optional(),
        })
    }

    beforeValidation(req) {
        if (req.query.has('status')) {
            req.query.set('status', req.query.get('status').split(','))
        }

        if (req.query.has('withProducts')) {
            req.query.set(
                'withProducts',
                req.query.get('withProducts') === 'true',
            )
        }

        if (req.query.has('customerId')) {
            req.query.set(
                'customerId',
                req.query.get('customerId').split(',').map(Number),
            )
        }
        if (req.query.has('customerId')) {
            req.query.set(
                'customerId',
                ('' + req.query.get('customerId')).split(',').map(Number),
            )
        }
    }

    static index() {
        return z.object({
            status: z
                .array(
                    z.enum([
                        OrderStatus.PENDING,
                        OrderStatus.PROCESSING,
                        OrderStatus.SHIPPED,
                        OrderStatus.DELIVERED,
                        OrderStatus.REFUNDED,
                        OrderStatus.CANCELLED,
                        OrderStatus.PAYMENT_FAILED,
                        OrderStatus.PAID,
                    ]),
                )
                .optional(),
            withProducts: z.boolean().optional(),
            customerId: z.array(z.number().int().positive()).optional(),
        })
    }
}
