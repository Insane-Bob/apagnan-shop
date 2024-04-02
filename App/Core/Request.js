import { ParametersBag } from './ParametersBag.js'

export class Request {
  constructor(req) {
    this._req = req
    this.query = new ParametersBag(req.query)
    this.params = new ParametersBag(req.params)
    this.headers = new ParametersBag(req.headers)
    if (this.headers.get('content-type') === 'application/json') {
      this.body = new ParametersBag(req.body)
    }
  }
}
