import { Controller } from '../../Core/Controller.js'
import { UserNotificationPolicy } from '../Policies/UserNotificationPolicy.js'
import { UserNotificationServices } from '../../Services/UserNotificationServices.js'
import { Database } from '../../Models/index.js'
import { UserNotificationValidator } from '../../Validator/UserNotificationValidator.js'

export class UserNotificationController extends Controller {
    user_resource // @provided by UserProvider
    async index() {
        this.can(UserNotificationPolicy.index, this.user_resource)
        const subscriptions =
            await Database.getInstance().models.UserNotificationSubscription.findAll(
                {
                    where: {
                        userId: this.user_resource.id,
                    },
                },
            )
        const preferences =
            UserNotificationServices.getUserNotificationPreferencesFromNotificationSubscriptions(
                subscriptions,
            )

        this.res.json(preferences)
    }
    async toggle() {
        this.can(UserNotificationPolicy.index, this.user_resource)
        const payload = this.validate(UserNotificationValidator)
        if (payload.modelId) {
            let exists =
                await Database.getInstance().models.UserNotificationSubscription.findOne(
                    {
                        attributes: ['id'],
                        where: {
                            userId: this.user_resource.id,
                            modelId: payload.modelId,
                            modelType: payload.modelType,
                            type: payload.type,
                        },
                    },
                )
            if (exists) {
                exists.activated = payload.activated
                await exists.save()
                this.res.status(200).json(exists)
            } else {
                const instance =
                    await Database.getInstance().models.UserNotificationSubscription.create(
                        {
                            userId: this.user_resource.id,
                            modelId: payload.modelId,
                            modelType: payload.modelType,
                            type: payload.type,
                            activated: payload.activated,
                        },
                    )
                this.res.status(201).json(instance)
            }
        } else {
            await Database.getInstance().models.UserNotificationSubscription.update(
                {
                    activated: payload.activated,
                },
                {
                    where: {
                        userId: this.user_resource.id,
                        type: payload.type,
                    },
                },
            )
            return this.res.sendStatus(200)
        }
    }
}
