import { USER_ROLES } from '../../Models/SQL/user.js'
import { OrderStatus } from '../../Enums/OrderStatus.js'

export class OrderPolicy {
    static show(user, order) {
        if (user.hasRole(USER_ROLES.ADMIN)) return true
        return Number(user.customer.id) === Number(order.customerId)
    }

    static store(user, customerId) {
        return user.hasRole(USER_ROLES.ADMIN) || user.customer.id === customerId
    }

    static update(user, customerId, status) {
        return (
            user.hasRole(USER_ROLES.ADMIN) ||
            user.hasRole(USER_ROLES.STORE_KEEPER) ||
            (status == OrderStatus.CANCELLED && customerId == user.customer.id)
        )
    }
}
