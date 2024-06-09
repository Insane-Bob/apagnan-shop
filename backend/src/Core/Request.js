import { ParametersBag } from './ParametersBag.js'

export class Request {
    constructor(req) {
        this._req = req
        this.query = new ParametersBag(req.query)
        this.headers = new ParametersBag(req.headers)
        if (this.headers.get('content-type') === 'application/json') {
            this.body = new ParametersBag(req.body)
        } else {
            this.body = new ParametersBag({})
        }
        this.route = null
        this.user = null
        this.token = null
    }
    loadParams() {
        this.params = new ParametersBag(this._req.params)
    }
    setUser(user) {
        this.user = user
    }
    getUser() {
        return this.user
    }
    setToken(token) {
        this.token = token
    }

    /**
     * @param {Route} route
     */
    setRoute(route) {
        this.route = route
    }
}
