import { AccountActivatedEmail } from '../Emails/AccountActivatedEmail.js'
import { ConnectionAttempt3FailedEmail } from '../Emails/ConnectionAttempt3FailedEmail.js'
import { DeliveryEmail } from '../Emails/DeliveryEmail.js'
import { FailedPaymentEmail } from '../Emails/FailedPaymentEmail.js'
import { RegisterEmail } from '../Emails/RegisterEmail.js'
import { ResetPasswordEmail } from '../Emails/ResetPasswordEmail.js'
import { SuccessPaymentEmail } from '../Emails/SuccessPaymentEmail.js'
import {  EmailSender } from '../lib/EmailSender.js'

export class NotificationsServices {
    static async notifyConnectionAttempt3Failed(user, accessLinkIdentifier) {
        const connectionAttempt3FailedEmail =
            new ConnectionAttempt3FailedEmail()
                .setParams({
                    name: user.firstName + ' ' + user.lastName,
                })
                .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)
        await EmailSender.send(
            connectionAttempt3FailedEmail,
            accessLinkIdentifier,
        )
    }

    static async notifyValidateEmail(user) {
        console.log(`Sending validate email to ${user.email}`)
    }

    static async notifyRegisterUser(user) {
        const registerEmail = new RegisterEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)
        await EmailSender.send(registerEmail)
    }

    static async notifyResetPassword(user) {
        const resetPasswordEmail = new ResetPasswordEmail()
            .setParams({
                name: user.firstName + ' ' + user.lastName,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(resetPasswordEmail)
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
                order: order.id,
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

    static async notifyNewRefundRequest(refundRequest) {
        console.log(`Sending new refund request notification to admins`)
    }
    static async notifyACKRefund(customer, refundRequest) {
        console.log(`Sending refund ack notification to ${customer.email}`)
    }
    static notifyRefundApproved(customer, refund) {
        console.log(`Sending refund approved notification to ${customer.email}`)
    }

    static async notifyDeliveryOrder(user, product, order) {
        const notifyEmail = new DeliveryEmail()
            .setParams({
                user: user.firstName + ' ' + user.lastName,
                product_name: product.name,
                quantity: order.quantity,
                order: order.number,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(notifyEmail)
    }

    static async notifyAccountActivated(user) {
        const activatedAccountEmail = new AccountActivatedEmail()
            .setParams({
                user: user.firstName + ' ' + user.lastName,
            })
            .addTo(`${user.email}`, `${user.firstName} ${user.lastName}`)

        await EmailSender.send(activatedAccountEmail)
    }

    static async notifyOrderStatusUpdate(order, status) {
        //@TODO : send email to the customer to notify him that his order status has changed
    }
}
