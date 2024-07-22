import { ParametersBag } from './ParametersBag.js'

export class Request {
    constructor(req) {
        this._req = req
        this.query = new ParametersBag(req.query)
        this.headers = new ParametersBag(req.headers)
        if (
            this.headers.has('content-type') &&
            this.headers.get('content-type').indexOf('application/json') > -1
        ) {
            this.body = new ParametersBag(JSON.parse(req.body.toString()))
        } else {
            this.body = new ParametersBag({})
        }
        this.route = null
        this.user = null
        this.token = null
    }

    get files(){
        return new ParametersBag(this._req.files)
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
