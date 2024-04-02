import { Router } from '../../Core/Router.js'
import { AuthController } from '../../Http/Controllers/AuthController.js'

/**
 * Auth routes
 * @param {Router} router
 */
export default function (router) {
  router.get('/test', AuthController, 'test')
  router.group('/api/auth', function () {
    this.post('/login', AuthController, 'login')
    this.post('/logout', AuthController, 'logout')
  })
}
