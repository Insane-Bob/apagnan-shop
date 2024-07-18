import { Validator } from './Validator.js'
import { z } from 'zod'
import { NotificationSubscriptionType } from '../Enums/NotificationSubscriptionType.js'

export class UserNotificationValidator extends Validator {
    constructor(schema = UserNotificationValidator.toggle()) {
        super(schema)
    }

    static toggle() {
        return z
            .object({
                activated: z.boolean(),
                type: z.enum([
                    NotificationSubscriptionType.PRODUCT_PRICE_CHANGE,
                    NotificationSubscriptionType.PRODUCT_RESTOCK,
                    NotificationSubscriptionType.NEW_PRODUCT,
                ]),
                modelId: z.number().optional(),
                modelType: z.string().optional(),
            })
            .refine(
                (data) => {
                    if (data.modelId) {
                        return Boolean(data.modelType)
                    }
                    if (data.modelType) {
                        return Boolean(data.modelId)
                    }
                    return true
                },
                {
                    message:
                        'modelId and modelType must be both present or both absent',
                    path: ['modelId', 'modelType'],
                },
            )
    }
}
