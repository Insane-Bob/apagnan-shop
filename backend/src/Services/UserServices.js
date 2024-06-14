import bcrypt from 'bcryptjs'
import { Database } from '../Models/index.js'
export class UserServices {
    static hashPassword(plainPassword) {
        return bcrypt.hashSync(plainPassword, 8)
    }

    static comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword)
    }

    /**
     * Register a new user, and create a customer profile for it
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} email
     * @param {string} password plain text password
     * @returns {Promise<User>}
     */
    static async registerUser(firstName, lastName, email, password) {
        const hashedPassword = this.hashPassword(password)
        const user = await Database.getInstance().models.User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        })

        await Database.getInstance().models.Customer.create({
            userId: user.id,
        })

        return user
    }

    static retrieveUserByEmail(email) {
        return Database.getInstance().models.User.findOne({
            where: {
                email,
            },
        })
    }

    /**
     * Notifications
     */
    static sendConnectionAttemptNotification(user, accessLinkIdentifier) {
        console.log(`Sending connection attempt notification to ${user.email}`)
    }

    static sendResetPasswordNotification(user, accessLinkIdentifier) {
        console.log(`Sending reset password notification to ${user.email}`)
    }
}
