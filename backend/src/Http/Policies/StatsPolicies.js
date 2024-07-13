import { USER_ROLES } from '../../Models/user.js'

export class StatsPolicies {
    static view(user) {
        return user.hasRole(USER_ROLES.ADMIN)
    }
}
