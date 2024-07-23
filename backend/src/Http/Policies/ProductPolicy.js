import { USER_ROLES } from '../../Models/SQL/user.js'

export class ProductPolicy {
    static index() {
        return true
    }
    static show() {
        return true
    }
    static update(user) {
        return (
            user.hasRole(USER_ROLES.ADMIN)
        )
    }
    static updateStock(user) {
        return (
            user.hasRole(USER_ROLES.ADMIN)
        ) || (
            user.hasRole(USER_ROLES.STOCK_MANAGER)
        )
    }
    static delete(user) {
        return ProductPolicy.update(user)
    }
}
