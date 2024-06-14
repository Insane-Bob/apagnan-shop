import fs from 'fs'
import path from 'path'
import { Request } from './Request.js'
import { Middleware } from './Middleware.js'
import { Provider } from './Provider.js'

export class RouteGroup {
    constructor(path, callback, middlewares = [], providers = []) {
        this.path = path
        this.callback = callback
        this.routes = []
        this.middlewares = middlewares
        this.providers = providers
    }

    createRoute(
        method,
        path,
        controller,
        action,
        middlewares = [],
        providers = [],
    ) {
        const routesMiddlewares = [...this.middlewares, ...middlewares]
        const routesProviders = [...this.providers, ...providers]
        const route = new Route(
            path,
            controller,
            action,
            method,
            routesMiddlewares,
            routesProviders,
        )
        this.routes.push(route)
        return route
    }
    get(...args) {
        return this.createRoute('get', ...args)
    }
    post(...args) {
        return this.createRoute('post', ...args)
    }
    put(...args) {
        return this.createRoute('put', ...args)
    }
    delete(...args) {
        return this.createRoute('delete', ...args)
    }
    group(path, callback) {
        const group = new RouteGroup(
            path,
            callback,
            this.middlewares,
            this.providers,
        )
        this.routes.push(group)
        return group
    }
    loadRoutes() {
        this.callback.call(this)
    }
    middleware(middleware, priority = 0) {
        if (middleware.prototype instanceof Middleware) {
            middleware.priority = priority
            this.middlewares.push(middleware)
        }
        return this
    }

    provide(provider) {
        if (provider.prototype instanceof Provider)
            this.providers.push(provider)
        return this
    }
}

export class Router extends RouteGroup {
    static instance = null

    static getInstance(app) {
        if (!Router.instance) {
            Router.instance = new Router(app)
        }
        return Router.instance
    }

    constructor(
        app,
        path = '',
        callback = () => {},
        middlewares = [],
        providers = [],
    ) {
        super(path, callback, middlewares, providers)
        this.app = app
    }

    registerRoutes(app) {
        for (let route of this.routes) {
            if (route instanceof Route) {
                const { path, controller, action, method } = route
                const orderMiddlewares = route.middlewares.sort(
                    (a, b) => b.priority - a.priority,
                )
                const middlewareHandlers = orderMiddlewares.map((middleware) =>
                    new middleware().getExpressHandler(),
                )
                app[method](
                    this.path + path,
                    ...middlewareHandlers,
                    (req, res) => {
                        req.request.setRoute(route)
                        const controllerInstance = new controller(
                            req.request,
                            res,
                        )
                        return controllerInstance.handleRequest(action)
                    },
                )
            } else if (route instanceof RouteGroup) {
                const router = new Router(
                    app,
                    this.path + route.path,
                    route.callback,
                    route.middlewares,
                    route.providers,
                )
                router.loadRoutes()
                router.registerRoutes(app)
            }
        }
    }

    async discoverRoutes() {
        /**read all files and sub files in routes */
        // eslint-disable-next-line no-undef
        const normalizedPath = path.resolve('src/Routes')
        function readDir(dir) {
            let files = fs.readdirSync(dir)
            files = files.map((file) => {
                const filePath = path.join(dir, file)
                if (fs.statSync(filePath).isDirectory()) {
                    let file = readDir(filePath)
                    return file
                }
                return filePath
            })
            return files.flat()
        }

        const files = readDir(normalizedPath)
        for (let file of files) {
            const module = await import(file)
            if (module.default instanceof Function) module.default(this)
        }
    }

    async init(app) {
        app.use((req, res, next) => {
            const request = new Request(req)
            req.request = request
            next()
        })
        await this.discoverRoutes()
        this.registerRoutes(app)
    }
}

export class Route {
    constructor(
        path,
        controller,
        action,
        method,
        middlewares = [],
        providers = [],
    ) {
        this.path = path
        this.controller = controller
        this.action = action
        this.method = method
        this.middlewares = middlewares
        this.providers = providers
    }

    middleware(middleware, priority = 0) {
        if (middleware.prototype instanceof Middleware) {
            middleware.priority = priority
            this.middlewares.push(middleware)
        }
        return this
    }

    provide(provider) {
        if (provider.prototype instanceof Provider)
            this.providers.push(provider)
        return this
    }
}
