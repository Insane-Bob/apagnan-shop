import { USER_ROLES } from '../../Models/SQL/user.js'

export class UserPolicy {
    static index(user) {
        return user.hasRole(USER_ROLES.ADMIN)
    }
    static show(user, userResource) {
        return (
            user.hasRole(USER_ROLES.ADMIN) ||
            Number(user.id) === Number(userResource.id)
        )
    }
    static update(...args) {
        return UserPolicy.show(...args)
    }
    static delete(user, resource) {
        if (user.id == resource.id && user.hasRole(USER_ROLES.ADMIN))
            return false
        return UserPolicy.show(user, resource)
    }

    static I(user, ressource) {
        return Number(user.id) === Number(ressource.id)
    }
}
