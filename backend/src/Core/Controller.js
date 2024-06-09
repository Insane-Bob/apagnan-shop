import { RequestHandler } from './RequestHandler.js'

export class Controller extends RequestHandler {
    async provideDependencies() {
        /**
         *
         * @type {Array<Provider.constructor>}
         */
        let providers = this.req.route.providers
        for (let provider of providers) {
            let instance = new provider()
            const ressource = await instance.provide(this.req)
            this[provider.param] = ressource
        }
    }
}
