import { USER_ROLES } from '../../Models/user.js'

export class RefundPolicy {
    static index(user) {
        return user.hasRole(USER_ROLES.ADMIN)
    }

    static show(user, authCustomer, order) {
        if (user.hasRole(USER_ROLES.ADMIN)) return true
        return authCustomer.id === order.customerId
    }

    static approve(user) {
        return RefundPolicy.index(user)
    }
}
