import { USER_ROLES } from '../../Models/user.js'

export class SpecificPolicy {
    static index() {
        return true
    }
    static show() {
        return true
    }
    static update(user) {
        return user.hasRole(USER_ROLES.ADMIN)
    }
    static delete(user) {
        return SpecificPolicy.update(user)
    }
}
