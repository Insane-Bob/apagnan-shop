import { UserWidgetController } from '../../../Http/Controllers/UserWidgetController.js'
import { UserWidgetProvider } from '../../../Http/Providers/UserWidgetProvider.js'

export function widgetRoute(userRouteGroup) {
  userRouteGroup.group('/widget', function () {
    this.get('/', UserWidgetController, 'showUserWidget')
    this.put('/', UserWidgetController, 'put')
  }).provide(UserWidgetProvider)
}
