import { UserNotificationController } from '../../../Http/Controllers/UserNotificationController.js'

export function widgetRoute(userRouteGroup) {
    userRouteGroup.group('/notifications', function () {
        this.get('/', UserNotificationController, 'show')
        this.post('/:type', UserNotificationController, 'toggle')
    })
}
