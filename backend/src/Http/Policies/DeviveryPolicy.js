import { USER_ROLES } from '../../Models/user.js'

export class DeliveryPolicy {
    static show(user, order) {
        return (
            user.hasRole(USER_ROLES.ADMIN) ||
            Number(user.customer.id) === Number(order.customerId)
        )
    }
    static create(user) {
        return user.hasRole(USER_ROLES.ADMIN)
    }
}
