import { Router } from '../../Core/Router.js'
import { AuthController } from '../../Http/Controllers/AuthController.js'

/**
 * Auth routes
 * @param {Router} router
 */
export default function (router) {
  router.group('/api/auth', function () {
    this.post('/login', AuthController, 'login')
    this.post('/logout', AuthController, 'logout')
  })
}
