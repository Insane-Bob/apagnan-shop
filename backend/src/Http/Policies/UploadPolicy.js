import { USER_ROLES } from '../../Models/SQL/user.js'

export class UploadPolicy {
    static upload(user) {
        return user.role === USER_ROLES.ADMIN
    }
}
