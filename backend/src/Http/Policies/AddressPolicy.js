import { USER_ROLES } from '../../Models/SQL/user.js'

export class AddressPolicy {
    static show(user, Address) {
        if (user.hasRole(USER_ROLES.ADMIN)) return true
        return Number(user.customer.id) === Number(Address.customerId)
    }

    static create(user, customerId) {
        if (user.hasRole(USER_ROLES.ADMIN)) return true
        return Number(user.customer.id) === Number(customerId)
    }
}
