export class NotificationsServices {
    static async notifyConnectionAttempt3Fail(user, accessLinkIdentifier) {
        console.log(`Sending connection attempt notification to ${user.email}`)
    }

    static async notifyResetPassword(user, accessLinkIdentifier) {
        console.log(`Sending reset password notification to ${user.email}`)
    }

    static async notifySuccessPaymentCustomer(order) {
        console.log('Notify customer payment success')
        //@TODO : Implement email notification
    }

    static async notifyFailedPaymentCustomer(order) {
        console.log('Notify customer payment failed')
        //@TODO : Implement email notification
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
