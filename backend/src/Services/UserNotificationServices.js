import { NotificationSubscriptionType } from '../Enums/NotificationSubscriptionType.js'
import { Database } from '../Models/index.js'

export class UserNotificationServices {
    /**
     * @typedef {Object} NotificationSubscription
     * @property {string} type
     * @property {boolean} activated
     * @property {number} modelId
     * @property {string} modelType
     */

    /**
     * @typedef {Object} UserNotificationPreference
     * @property {boolean} active
     * @property {number} activatedCount
     * @property {number} deactivatedCount
     */

    /**
     * @param {[NotificationSubscription]} notificationSubscriptions
     * @returns {UserNotificationPreference[]}
     */
    static getUserNotificationPreferencesFromNotificationSubscriptions(
        notificationSubscriptions,
    ) {
        const userNotificationPreferences = {}
        Object.values(NotificationSubscriptionType).forEach((type) => {
            const filtered = notificationSubscriptions.filter(
                (n) => n.type === type,
            )
            const activated = filtered.filter((n) => n.activated)
            const activatedCount = activated.length
            const deactivatedCount = filtered.filter((n) => !n.activated).length
            /**
             * @type {UserNotificationPreference}
             */
            userNotificationPreferences[type] = {
                active: activatedCount > 0,
                activatedCount,
                deactivatedCount,
                ids: activated.map((n) => n.modelId),
            }
        })
        return userNotificationPreferences
    }

    static async getUserThatAreSubscribeForProduct(productID, where = {}) {
        let usersIds =
            await Database.getInstance().models.UserNotificationSubscription.findAll(
                {
                    attributes: ['userId'],
                    where: {
                        modelId: productID,
                        modelType: 'product',
                        activated: true,
                        ...where,
                    },
                    group: ['userId'],
                },
            )

        return Database.getInstance().models.User.findAll({
            where: {
                id: usersIds.map((u) => u.userId),
            },
        })
    }

    static async getUserThatAreSubscribeForCollection(
        collectionID,
        where = {},
    ) {
        let usersIds =
            await Database.getInstance().models.UserNotificationSubscription.findAll(
                {
                    attributes: ['userId'],
                    where: {
                        modelId: collectionID,
                        modelType: 'collection',
                        activated: true,
                        ...where,
                    },
                    group: ['userId'],
                },
            )

        return Database.getInstance().models.User.findAll({
            where: {
                id: usersIds.map((u) => u.userId),
            },
        })
    }
}
