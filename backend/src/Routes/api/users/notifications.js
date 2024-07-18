import { UserNotificationController } from '../../../Http/Controllers/UserNotificationController.js'

export function notificationsRoutes(userRouteGroup) {
    userRouteGroup.group('/notifications', function () {
        this.get('/', UserNotificationController, 'index')
        this.post('/:type', UserNotificationController, 'toggle')
    })
}
