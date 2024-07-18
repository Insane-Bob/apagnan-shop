export class UserNotificationPolicy {
    static index(user, user_ressource) {
        return user.id === user_ressource.id
    }
}
