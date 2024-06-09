import { Request } from '../Core/Request.js'
import { User } from '../Models/user.js'

export function actingAs(user) {
    user = {
        ...user,
        hasRole(role) {
            return this.role === role
        },
    }
    Request.prototype.getUser = jest.fn().mockReturnValue(user)
    return user
}
