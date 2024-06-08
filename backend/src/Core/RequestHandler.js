import {
    ForbiddenException,
    HTTPException,
    InternalError,
    UnauthorizedException,
} from '../Exceptions/HTTPException.js'

export class RequestHandler {
    /**
     *
     * @param {?Request} req
     * @param res
     */
    constructor(req = null, res = null) {
        this.req = req
        this.res = res
    }

    provideDependencies() {
        return
    }

    can(action, ...args) {
        UnauthorizedException.abortIf(!this.req.getUser())
        let res = action(this.req.getUser(), ...args)
        ForbiddenException.abortIf(!res)
    }

    async handleRequest(action, ...args) {
        try {
            this.req.loadParams()
            await this.provideDependencies()
            await this[action](...args)
        } catch (e) {
            console.error(e)
            if (e instanceof HTTPException) {
                let json = e.toJSON()
                this.res.status(json.status).json(json)
                return
            }
            let json = new InternalError().toJSON()
            this.res.status(json.status).json(json)
        }
    }

    validate(validatorClass) {
        const validatorInstance = new validatorClass()
        return validatorInstance.validate(this.req.body.all())
    }
}
