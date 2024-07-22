import { AccountActivatedEmail } from '../Emails/AccountActivatedEmail.js'
import { ConnectionAttempt3FailedEmail } from '../Emails/ConnectionAttempt3FailedEmail.js'
import { DeliveryEmail } from '../Emails/DeliveryEmail.js'
import { FailedPaymentEmail } from '../Emails/FailedPaymentEmail.js'
import { RegisterEmail } from '../Emails/RegisterEmail.js'
import { ResetPasswordEmail } from '../Emails/ResetPasswordEmail.js'
import { EmailSender } from '../lib/EmailSender.js'
import { ConfirmResetPasswordEmail } from '../Emails/ConfirmResetPasswordEmail.js'
import { LowStockProduct } from '../Emails/LowStockProduct.js'
import { OutOfStockProduct } from '../Emails/OutOfStockProduct.js'
import { UserNotificationServices } from './UserNotificationServices.js'
import { NotificationSubscriptionType } from '../Enums/NotificationSubscriptionType.js'
import { UserServices } from './UserServices.js'
import { SuccessPaymentEmail } from '../Emails/SuccessPaymentEmail.js'
import { OrderSupportedEmail } from '../Emails/OrderSupportedEmail.js'

export class NotificationsServices {
    static async notifyConnectionAttempt3Failed(user, accessLinkIdentifier) {
        const connectionAttempt3FailedEmail =
            new ConnectionAttempt3FailedEmail()
                .setParams({
                    name: user.firstName + ' ' + user.lastName,
                })
                .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)
        await EmailSender.send(connectionAttempt3FailedEmail)
    }

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

    static async notifyConfirmResetPassword(user) {
        const confirmResetPasswordEmail = new ConfirmResetPasswordEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(confirmResetPasswordEmail)
    }

    static async notifyRenewedPassword(user) {
        const renewedPasswordEmail = new ResetPasswordEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(renewedPasswordEmail)
    }

    static async notifySuccessPaymentCustomer(user, order) {
        const successPaymentEmail = new SuccessPaymentEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
                order_id: order.id,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(successPaymentEmail)
    }

    static async notifyFailedPaymentCustomer(user) {
        const failedPaymentEmail = new FailedPaymentEmail()
            .setParams({
                user: user.firstName + ' ' + user.lastName,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(failedPaymentEmail)
    }

    static async notifyAccountActivated(user) {
        const activatedAccountEmail = new AccountActivatedEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(activatedAccountEmail)
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

    static async notifyOrderSupported(user, order) {
        const orderLink = `${process.env.FRONT_END_URL}/profile/command/${order}`
        const orderSupportedEmail = new OrderSupportedEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
                order_id: orderLink,
            })
            .addTo(
                `${user.email}`,
                `${user.firstName} ${user.lastName}`,
            )

        await EmailSender.send(orderSupportedEmail)
    }

    // !!! NOT USED YET !!!
    // ---------------------
    // static async notifyDeliveryOrder(user, product, order) {
    //     const notifyEmail = new DeliveryEmail()
    //         .setParams({
    //             user: user.firstName + ' ' + user.lastName,
    //             product_name: product.name,
    //             quantity: order.quantity,
    //             order: order.number,
    //         })
    //         .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

    //     await EmailSender.send(notifyEmail)
    // }

    static async notifyOrderStatusUpdate(order, status) {
        //@TODO : send email to the customer to notify him that his order status has changed
    }

    static async notifLowStockProduct(product) {
        const lowStockProductEmail = new LowStockProduct().setParams({
            name: product.name,
        })
        const adminMails = await UserServices.retrieveAdminUsersMail()
        adminMails.forEach((mail) => {
            lowStockProductEmail.addTo(mail.email, 'Admin')
        })
        await EmailSender.send(lowStockProductEmail)
    }

    static async notifNotifOutOfStockProduct(product) {
        const outOfStockProductEmail = new OutOfStockProduct().setParams({
            name: product.name,
        })

        const adminMails = await UserServices.retrieveAdminUsersMail()
        adminMails.forEach((mail) => {
            outOfStockProductEmail.addTo(mail.email, 'Admin')
        })
        await EmailSender.send(outOfStockProductEmail)
    }
    /**
     * Newsletter
     */

    static async notifyNewsletterSubscribe(email) {}

    static async notifyNewsletterUnsubscribe(email) {}

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
                console.log(
                    `Sending product restock notification to ${user.email}`,
                )
            }),
        )
    }

    static async notifyProductPriceUpdate(product) {
        const users =
            await UserNotificationServices.getUserThatAreSubscribeForProduct(
                product.id,
                {
                    type: NotificationSubscriptionType.PRODUCT_PRICE_CHANGE,
                },
            )

        return Promise.all(
            users.map(async (user) => {
                console.log(
                    `Sending product price update notification to ${user.email}`,
                )
            }),
        )
    }

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
                console.log(
                    `Sending new product in collection notification to ${user.email}`,
                )
            }),
        )
    }

    /**
     * RGPD
     */
    static async notifyUserPersonalDataDeleted(user) {}

    static async notifyUserPersonalDataJobEnd(user, url) {
        console.log(
            `Sending personal data job end notification to ${user.email} => url : ${url}`,
        )
    }
}
