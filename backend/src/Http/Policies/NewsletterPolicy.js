import { USER_ROLES } from '../../Models/SQL/user.js'

export class NewsletterPolicy {
    static index(user) {
        return user.hasRole(USER_ROLES.ADMIN)
    }
}
