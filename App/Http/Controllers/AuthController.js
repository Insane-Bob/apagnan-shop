import { Controller } from '../../Core/Controller.js'

export class AuthController extends Controller {
  constructor(req, res) {
    super(req, res)
  }

  login() {
    this.res.send('Login route')
  }
  logout() {}

  test() {
    this.res.send('Test route')
  }
}
