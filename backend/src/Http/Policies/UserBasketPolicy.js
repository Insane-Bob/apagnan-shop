export class UserBasketPolicy {
    static show(user, userResource) {
        return Number(user.id) === Number(userResource.id)
    }
}
