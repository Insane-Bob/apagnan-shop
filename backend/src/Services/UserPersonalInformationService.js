import { Database } from '../Models/index.js'
import crypto from 'crypto'
export class UserPersonalInformationService {
    static async anonymizeUserPersonalInformation(user, options) {
        user.firstName = 'Compte'
        user.lastName = 'Supprimé'
        user.email =
            crypto.randomBytes(8).toString('hex') +
            '@' +
            crypto.randomBytes(8).toString('hex')
        user.phone = null
        user.password = null
        user.emailVerifiedAt = null
        user.role = null
        await Promise.all([
            Database.getInstance().models.UserNotificationSubscription.destroy(
                {
                    where: {
                        userId: user.id,
                    },
                },
                options,
            ),
            Database.getInstance().models.UserConnectionAttempt.destroy(
                {
                    where: {
                        userId: user.id,
                    },
                },
                options,
            ),
            Database.getInstance().models.UserBasket.destroy(
                {
                    where: {
                        userId: user.id,
                    },
                },
                options,
            ),
            Database.getInstance().models.Token.destroy(
                {
                    where: {
                        userId: user.id,
                    },
                },
                options,
            ),
        ])

        await user.save(options)
        return user
    }
}
