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
    beforeEach() {
        return
    }

    can(action = null, ...args) {
        UnauthorizedException.abortIf(!this.req.getUser())
        if (!action) return
        let res = action(this.req.getUser(), ...args)
        ForbiddenException.abortIf(!res)
    }

    async handleRequest(action, ...args) {
        try {
            this.req.loadParams()
            await this.provideDependencies()
            await this.beforeEach()
            await this[action](...args)
        } catch (e) {
            if (process.env.TEST_CI === undefined) console.error(e)
            if (e instanceof HTTPException) {
                let json = e.toJSON()
                this.res.status(json.status).json(json)
                return
            }
            let json = new InternalError().toJSON()
            this.res.status(json.status).json(json)
        }
    }

    validate(validatorClass, schema = undefined) {
        const validatorInstance = new validatorClass(schema)
        validatorInstance.beforeValidation(this.req)
        const payload = validatorInstance.validate({
            ...this.req.params.all(),
            ...this.req.query.all(),
            ...this.req.body.all(),
        })
        let res = validatorInstance.afterValidation(payload)
        if (res instanceof Promise)
            return new Promise((resolve, reject) => {
                res.then(() => resolve(payload)).catch((e) => reject(e))
            })
        return payload
    }
}
