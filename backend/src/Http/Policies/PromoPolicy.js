import { USER_ROLES } from '../../Models/SQL/user.js'

export class PromoPolicy {
    static index(user) {
        if (user.hasRole(USER_ROLES.ADMIN)) return true
    }

    static update(user) {
        if (user.hasRole(USER_ROLES.ADMIN)) return true
    }
}
