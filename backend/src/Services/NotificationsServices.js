import { AccountActivatedEmail } from '../Emails/AccountActivatedEmail.js'
import { ConfirmResetPasswordEmail } from '../Emails/ConfirmResetPasswordEmail.js'
import { ConnectionAttempt3FailedEmail } from '../Emails/ConnectionAttempt3FailedEmail.js'
import { FailedPaymentEmail } from '../Emails/FailedPaymentEmail.js'
import { LowStockProductEmail } from '../Emails/LowStockProductEmail.js'
import { OrderSupportedEmail } from '../Emails/OrderSupportedEmail.js'
import { ProductPriceChangeEmail } from '../Emails/ProductPriceChangeEmail.js'
import { RegisterEmail } from '../Emails/RegisterEmail.js'
import { ResetPasswordEmail } from '../Emails/ResetPasswordEmail.js'
import { SubscribeNewsletterEmail } from '../Emails/SubscribeNewsletterEmail.js'
import { SuccessPaymentEmail } from '../Emails/SuccessPaymentEmail.js'
import { UnsubscribeNewsletterEmail } from '../Emails/UnsubscribeNewsletterEmail.js'
import { NotificationSubscriptionType } from '../Enums/NotificationSubscriptionType.js'
import { EmailSender } from '../lib/EmailSender.js'
import { UserNotificationServices } from './UserNotificationServices.js'
import { UserServices } from './UserServices.js'
import { NewProductEmail } from '../Emails/NewProductEmail.js'
import { OutOfStockProductEmail } from '../Emails/OutOfStockProductEmail.js'
import { OrderStatusChangedEmail } from '../Emails/OrderStatusChangedEmail.js'
import { ProductRestockEmail } from '../Emails/ProductRestockEmail.js'
import { UserPersonalInformationEmail } from '../Emails/UserPersonalInformationEmail.js'

export class NotificationsServices {
    // EMAIL WHEN THE USER MAKE MORE THAN 3 CONNECTION ATTEMPT
    static async notifyConnectionAttempt3Failed(user) {
        const connectionAttempt3FailedEmail =
            new ConnectionAttempt3FailedEmail()
                .setParams({
                    name: user.firstName + ' ' + user.lastName,
                })
                .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)
        await EmailSender.send(connectionAttempt3FailedEmail)
    }

    // EMAIL WHEN THE USER REGISTER FOR THE FIRST TIME
    static async notifyRegisterUser(user, accessLink) {
        const activation_link = `${process.env.APP_URL}/api/users/${user.id}/activate?a=${accessLink.identifier}`
        const registerEmail = new RegisterEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
                activation_link,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)
        await EmailSender.send(registerEmail)
    }

    // EMAIL WHEN THE USER HAS ACTIVATED HIS ACCOUNT
    static async notifyAccountActivated(user) {
        const activatedAccountEmail = new AccountActivatedEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(activatedAccountEmail)
    }

    // EMAIL WHEN THE USER WANT TO RESET HIS PASSWORD
    static async notifyResetPassword(user, accessLink) {
        const password_reset_link = `${process.env.FRONT_END_URL}/reset-password?user_id=${user.id}&a=${accessLink.identifier}`
        const resetPasswordEmail = new ResetPasswordEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
                password_reset_link,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(resetPasswordEmail)
    }

    // EMAIL WHEN THE USER HAS CHANGED HIS PASSWORD SUCCESSFULLY
    static async notifyConfirmResetPassword(user) {
        const confirmResetPasswordEmail = new ConfirmResetPasswordEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(confirmResetPasswordEmail)
    }

    // EMAIL AFTER 60 DAYS TO RENEW THE PASSWORD -- Not used
    static async notifyRenewedPassword(user) {
        const renewedPasswordEmail = new ResetPasswordEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(renewedPasswordEmail)
    }

    // EMAIL WHEN THE USER HAS SUCCESSFULLY PAID
    static async notifySuccessPaymentCustomer(user, order) {
        const successPaymentEmail = new SuccessPaymentEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
                order_id: order.id,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(successPaymentEmail)
    }

    // EMAIL WHEN THE USER HAS FAILED TO PAY
    static async notifyFailedPaymentCustomer(user) {
        const failedPaymentEmail = new FailedPaymentEmail()
            .setParams({
                user: user.firstName + ' ' + user.lastName,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(failedPaymentEmail)
    }

    // EMAIL WHEN THE USER HAS MADE AN ORDER
    static async notifyOrderSupported(user, order) {
        const orderLink = `${process.env.FRONT_END_URL}/profile/command/${order}`
        const orderSupportedEmail = new OrderSupportedEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
                order_id: orderLink,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(orderSupportedEmail)
    }

    // EMAIL WHEN THE ORDER STATUS OF THE USER HAS CHANGED
    static async notifyOrderStatusUpdate(order) {
        let user = await (
            await order.getCustomer()
        ).getUser({
            attributes: ['email', 'firstName', 'lastName'],
        })
        const orderLink = `${process.env.FRONT_END_URL}/profile/command/${order}`
        const orderStatusChangedEmail = new OrderStatusChangedEmail()
            .setParams({
                user: `${user.firstName} ${user.lastName}`,
                order_id: orderLink,
            })
            .addTo(user.email, `${user.firstName} ${user.lastName}`)
        await EmailSender.send(orderStatusChangedEmail)
    }

    /**
     * USER NOTIFICATIONS
     */
    // EMAIL FOR THE STOCK KEPPER | ADMIN THAT HAVE THE NOTIFICATION FOR THE OUT OF STOCK PRODUCT
    static async notifyOutOfStockProduct(product) {
        const admins = await UserServices.retrieveAdminUsersMail()

        await Promise.all(
            admins.map(async (admin) => {
                const outOfStockProductEmail = new OutOfStockProductEmail()
                    .setParams({
                        name: product.name,
                    })
                    .addTo(admin.email, 'Admin')

                await EmailSender.send(outOfStockProductEmail)
            }),
        )
    }

    // EMAIL FOR THE STOCK KEPPER | ADMIN THAT HAVE THE NOTIFICATION FOR THE LOW STOCK PRODUCT
    static async notifyLowStockProduct(product) {
        const lowStockProductEmail = new LowStockProductEmail().setParams({
            product_name: product.name,
            stock_left: product.stock,
        })
        const adminMails = await UserServices.retrieveAdminUsersMail()
        adminMails.forEach((mail) => {
            lowStockProductEmail.addTo(mail.email, 'Admin')
        })
        await EmailSender.send(lowStockProductEmail)
    }

    /**
     * Newsletter
     */
    static async notifyNewsletterSubscribe(email) {
        const unsubscribe_link = `${process.env.FRONT_END_URL}/unsubscribe`
        const subscribeNewsletterEmail = new SubscribeNewsletterEmail()
            .setParams({
                email,
                unsubscribe_link,
            })
            .addTo(`${email}`)
        await EmailSender.send(subscribeNewsletterEmail)
    }

    static async notifyNewsletterUnsubscribe(email) {
        const unsubcribeNewsletterEmail = new UnsubscribeNewsletterEmail()
            .setParams({
                email,
            })
            .addTo(`${email}`)
        await EmailSender.send(unsubcribeNewsletterEmail)
    }
    /**
     * USER NOTIFICATIONS
     */

    static async notifyProductRestock(product) {
        const users =
            await UserNotificationServices.getUserThatAreSubscribeForProduct(
                product.id,
                {
                    type: NotificationSubscriptionType.PRODUCT_RESTOCK,
                },
            )

        return Promise.all(
            users.map(async (user) => {
                const productRestockEmail = new ProductRestockEmail()
                    .setParams({
                        product_name: product.name,
                        stock: product.stock,
                    })
                    .addTo(user.email, `${user.firstName} ${user.lastName}`)

                await EmailSender.send(productRestockEmail)
            }),
        )
    }

    // EMAIL WHEN THE USER THAT HAVE THE PRICE CHANGE NOTIFICATION FOR THE PRODUCT
    static async notifyProductPriceUpdate(product) {
        const users =
            await UserNotificationServices.getUserThatAreSubscribeForProduct(
                product.id,
                {
                    type: NotificationSubscriptionType.PRODUCT_PRICE_CHANGE,
                },
            )

        await Promise.all(
            users.map(async (user) => {
                const productPriceChangeEmail = new ProductPriceChangeEmail()
                    .setParams({
                        name: product.name,
                        price: product.price,
                    })
                    .addTo(user.email, `${user.firstName} ${user.lastName}`)

                await EmailSender.send(productPriceChangeEmail)
            }),
        )
    }

    // EMAIL WHEN THE USER THAT HAVE THE NEW PRODUCT NOTIFICATION FOR THE COLLECTION
    static async notifyNewProductInCollection(product) {
        const users =
            await UserNotificationServices.getUserThatAreSubscribeForCollection(
                product.collectionId,
                {
                    type: NotificationSubscriptionType.NEW_PRODUCT,
                },
            )

        return Promise.all(
            users.map(async (user) => {
                const newProductEmail = new NewProductEmail()
                    .setParams({
                        name: product.name,
                        category: product.Collection,
                    })
                    .addTo(user.email, `${user.firstName} ${user.lastName}`)

                await EmailSender.send(newProductEmail)
            }),
        )
    }

    /**
     * RGPD
     */
    static async notifyUserPersonalDataDeleted(user) {}

    static async notifyUserPersonalDataJobEnd(user, url) {
        let email = new UserPersonalInformationEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
                url,
            })
            .addTo(user.email, `${user.firstName} ${user.lastName}`)
        await EmailSender.send(email)
    }

    static async notifyNewRefundRequest(refundRequest) {
        console.log(`Sending new refund request notification to admins`)
    }
    static async notifyACKRefund(customer, refundRequest) {
        console.log(`Sending refund ack notification to ${customer.email}`)
    }
    static notifyRefundApproved(customer, refund) {
        console.log(`Sending refund approved notification to ${customer.email}`)
    }
}
