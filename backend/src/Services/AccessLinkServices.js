import crypto from 'crypto'
import { Database } from '../Models/index.js'

export class AccessLinkServices {
    static getDate(minutes = 0, hours = 0, day = 0, month = 0, year = 0) {
        const date = new Date()
        date.setMinutes(date.getMinutes() + minutes)
        date.setHours(date.getHours() + hours)
        date.setDate(date.getDate() + day)
        date.setMonth(date.getMonth() + month)
        date.setFullYear(date.getFullYear() + year)
        return date
    }
    static createAccessLink(userId, validAt, expireAt, maxUseCount) {
        const hash = crypto.createHash('sha256')
        hash.update(`${userId}-${validAt}-${expireAt}`)
        const identifier = hash.digest('hex')

        return Database.getInstance().models.AccessLink.create({
            identifier,
            userId,
            validAt,
            expireAt,
            useCount: 0,
            maxUseCount,
        })
    }

    static retrieveAccessLinkByIdentifier(identifier) {
        return Database.getInstance().models.AccessLink.findOne({
            where: {
                identifier,
            },
        })
    }
}
