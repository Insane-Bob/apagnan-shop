import { Database } from '../Models/index.js'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { EncryptServices } from './EncryptServices.js'
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
        await this.deletePersonalInformationFiles(user.id)
        await user.save(options)
        return user
    }

    static async deletePersonalInformationFiles(userId) {
        const uploadDirFiles = fs.readdirSync('uploads').filter((f) => {
            return f.startsWith('u.') && f.split('.').length == 3
        })
        for (let file of uploadDirFiles) {
            const [header, prefixEncrypted, hashFile] = file.split('.')
            const decryptedPrefix = EncryptServices.decrypt(
                EncryptServices.base64ToEncryptedPayload(prefixEncrypted),
            ).toString()

            if (decryptedPrefix.indexOf('user_') < 0) continue
            const fileUserId = decryptedPrefix.split('_')[1]
            if (Number(userId) !== Number(fileUserId)) continue
            await Database.getInstance().models.Upload.destroy({
                where: {
                    hash: hashFile,
                },
            })
            fs.unlinkSync(path.resolve('uploads', file))
        }
    }
}
