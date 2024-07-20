export class UserWidgetPolicy {
    static show(user, userResource) {
        return user.id === userResource.id
    }
}
