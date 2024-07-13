import { USER_ROLES } from '../../Models/SQL/user.js'

export class SearchPolicy {
    static search(user) {
        return user.hasRole(USER_ROLES.ADMIN)
    }
}
