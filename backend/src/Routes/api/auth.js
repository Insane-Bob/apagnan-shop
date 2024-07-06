import { AuthController } from '../../Http/Controllers/AuthController.js'
/**
 * Auth routes
 * @param {Router} router
 */
export default function (router) {
    router.group('/api', function () {
        this.post('/register', AuthController, 'register')
        this.get('/login/:identifier', AuthController, 'loginWithAccessLink')
        this.post('/login', AuthController, 'login')
        this.post('/logout', AuthController, 'logout')
        this.post('/refresh-token', AuthController, 'refreshToken')
        this.get('/me', AuthController, 'me')
        this.post('/reset-password', AuthController, 'resetPassword')
        this.post('/activation-email', AuthController, 'activationEmail')
        this.get('/activate-account/:token', AuthController, 'activateAccount')
    })
}
