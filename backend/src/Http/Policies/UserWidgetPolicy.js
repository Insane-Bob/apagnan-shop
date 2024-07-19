import { USER_ROLES } from '../../Models/SQL/user.js'

export class UserWidgetPolicy {
    static show(user, userResource) {
        if (user.hasRole(USER_ROLES.ADMIN)) {
            return true
        }
        return user.id === userResource.id
    }
}
