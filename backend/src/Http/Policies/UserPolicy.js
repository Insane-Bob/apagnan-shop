import { USER_ROLES } from '../../Models/user.js'

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
    static delete(...args) {
        return UserPolicy.show(...args)
    }
}
