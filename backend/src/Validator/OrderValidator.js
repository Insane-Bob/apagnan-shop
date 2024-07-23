import { z } from 'zod'
import { Validator } from './Validator.js'
import { OrderStatus } from '../Enums/OrderStatus.js'

const translation = {
    customerId: {
        int: "L'ID client doit être un entier.",
        positive: "L'ID client doit être un nombre positif.",
    },
    shippingAddressId: {
        int: "L'ID de l'adresse de livraison doit être un entier.",
        positive: "L'ID de l'adresse de livraison doit être un nombre positif.",
    },
    billingAddressId: {
        int: "L'ID de l'adresse de facturation doit être un entier.",
        positive:
            "L'ID de l'adresse de facturation doit être un nombre positif.",
    },
    promoId: {
        int: "L'ID de la promotion doit être un entier.",
    },
    products: {
        productId: {
            int: "L'ID du produit doit être un entier.",
            positive: "L'ID du produit doit être un nombre positif.",
        },
        quantity: {
            int: 'La quantité doit être un entier.',
            positive: 'La quantité doit être un nombre positif.',
        },
    },
    status: {
        enum: 'Le statut doit être une valeur valide.',
    },
    reason: {
        string: 'La raison doit être une chaîne de caractères.',
    },
    withProducts: {
        boolean: "Le champ 'avec produits' doit être un booléen.",
    },
}

export class OrderValidator extends Validator {
    constructor(schema = OrderValidator.create()) {
        super(schema)
    }

    static create() {
        return z.object({
            customerId: z
                .number()
                .int()
                .positive({
                    message: translation.customerId.positive,
                })
                .refine((value) => value > 0, {
                    message: translation.customerId.int,
                }),
            shippingAddressId: z
                .number()
                .int()
                .positive({
                    message: translation.shippingAddressId.positive,
                })
                .refine((value) => value > 0, {
                    message: translation.shippingAddressId.int,
                }),
            billingAddressId: z
                .number()
                .int()
                .positive({
                    message: translation.billingAddressId.positive,
                })
                .refine((value) => value > 0, {
                    message: translation.billingAddressId.int,
                }),
            promoId: z
                .number()
                .int({
                    message: translation.promoId.int,
                })
                .optional(),
            products: z.array(
                z.object({
                    productId: z
                        .number()
                        .int()
                        .positive({
                            message: translation.products.productId.positive,
                        })
                        .refine((value) => value > 0, {
                            message: translation.products.productId.int,
                        }),
                    quantity: z
                        .number()
                        .int()
                        .positive({
                            message: translation.products.quantity.positive,
                        })
                        .refine((value) => value > 0, {
                            message: translation.products.quantity.int,
                        }),
                }),
            ),
        })
    }

    static update() {
        return z.object({
            status: z.enum(
                [
                    OrderStatus.PENDING,
                    OrderStatus.PROCESSING,
                    OrderStatus.SHIPPED,
                    OrderStatus.DELIVERED,
                    OrderStatus.REFUNDED,
                    OrderStatus.CANCELLED,
                ],
                {
                    message: translation.status.enum,
                },
            ),
            reason: z
                .string({
                    message: translation.reason.string,
                })
                .optional(),
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
                ('' + req.query.get('customerId')).split(',').map(Number),
            )
        }
    }

    static index() {
        return z.object({
            status: z
                .array(
                    z.enum(
                        [
                            OrderStatus.PENDING,
                            OrderStatus.PROCESSING,
                            OrderStatus.SHIPPED,
                            OrderStatus.DELIVERED,
                            OrderStatus.REFUNDED,
                            OrderStatus.CANCELLED,
                            OrderStatus.PAYMENT_FAILED,
                            OrderStatus.PAID,
                        ],
                        {
                            message: translation.status.enum,
                        },
                    ),
                )
                .optional(),
            withProducts: z
                .boolean({
                    message: translation.withProducts.boolean,
                })
                .optional(),
            customerId: z
                .array(
                    z
                        .number()
                        .int()
                        .positive({
                            message: translation.customerId.positive,
                        })
                        .refine((value) => value > 0, {
                            message: translation.customerId.int,
                        }),
                )
                .optional(),
        })
    }
}
