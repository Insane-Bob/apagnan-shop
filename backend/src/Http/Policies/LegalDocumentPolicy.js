import { USER_ROLES } from '../../Models/SQL/user.js'

export class LegalDocumentPolicy {
    static index(user) {
        return user.hasRole(USER_ROLES.ADMIN)
    }
}
