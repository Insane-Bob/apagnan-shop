import { Request } from './Request.js'

export class Controller {
  /**
   * @param {Request} req
   * @param {*} res
   */
  constructor(req, res) {
    this.req = req
    this.res = res
  }
}
