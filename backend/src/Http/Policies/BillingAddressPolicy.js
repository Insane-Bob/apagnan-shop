import { USER_ROLES } from '../../Models/SQL/user.js'

export class BillingAddressPolicy {
    static show(user, billingAddress) {
        if (user.hasRole(USER_ROLES.ADMIN)) return true
        return Number(user.customer.id) === Number(billingAddress.customerId)
    }

    static create(user, customerId) {
        if (user.hasRole(USER_ROLES.ADMIN)) return true
        return Number(user.customer.id) === Number(customerId)
    }
}
