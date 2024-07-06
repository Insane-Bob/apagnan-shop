import { USER_ROLES } from '../../Models/user.js'

export class OrderPolicy {
    static show(user, order) {
        if (user.hasRole(USER_ROLES.ADMIN)) return true
        return Number(user.customer.id) === Number(order.customerId)
    }

    static store(user, customerId) {
        return user.hasRole(USER_ROLES.ADMIN) || user.customer.id === customerId
    }
}
