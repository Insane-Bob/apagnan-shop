import { Request } from '../Core/Request.js'
import { User } from '../Models/SQL/user.js'

export function actingAs(user) {
    if (!(user instanceof User)) {
        user = {
            ...user,
            hasRole(role) {
                return this.role === role
            },
        }
    }
    Request.prototype.getUser = jest.fn().mockReturnValue(user)
    return user
}
