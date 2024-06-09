import { USER_ROLES } from '../../Models/user.js'

export class UserBasketPolicy {
    static update(user, userResource) {
        return Number(user.id) === Number(userResource.id)
    }
}
