import { Controller } from '../../Core/Controller.js'
import { UserNotificationPolicy } from '../Policies/UserNotificationPolicy.js'
import { UserNotificationServices } from '../../Services/UserNotificationServices.js'
import { Database } from '../../Models/index.js'
import { UserNotificationValidator } from '../../Validator/UserNotificationValidator.js'

export class UserNotificationController extends Controller {
    user_ressource // @provided by UserProvider
    async index() {
        this.can(UserNotificationPolicy.index, this.user_ressource)
        const subscriptions =
            await Database.getInstance().models.UserNotificationSubscription.findAll(
                {
                    where: {
                        userId: this.user_ressource.id,
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
        this.can(UserNotificationPolicy.index, this.user_ressource)
        const payload = this.validate(UserNotificationValidator)
        if (payload.modelId) {
            const [instance, created] =
                await Database.getInstance().models.UserNotificationSubscription.upsert(
                    {
                        userId: this.user_ressource.id,
                        modelId: payload.modelId,
                        modelType: payload.modelType,
                        type: payload.type,
                        activate: payload.activate,
                    },
                    {
                        where: {
                            userId: this.user_ressource.id,
                            modelId: payload.modelId,
                            modelType: payload.modelType,
                            type: payload.type,
                        },
                    },
                )
            return this.res.status(created ? 201 : 200).json(instance)
        } else {
            await Database.getInstance().models.UserNotificationSubscription.update(
                {
                    activate: payload.activate,
                },
                {
                    where: {
                        userId: this.user_ressource.id,
                        type: payload.type,
                    },
                },
            )
            return this.res.status(200)
        }
    }
}
