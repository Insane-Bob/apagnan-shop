import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { Request } from './Request.js'
import {Middleware} from "./Middleware.js";


export class RouteGroup {
  constructor(path, callback, middlewares = []) {
    this.path = path
    this.callback = callback
    this.routes = []
    this.middlewares = middlewares
  }

  createRoute(method, path, controller, action, middlewares = []) {
    const routesMiddlewares = [...this.middlewares, ...middlewares]
    const route = new Route(path, controller, action, method, routesMiddlewares)
    this.routes.push(route)
    return route
  }
  get(...args) {
    return this.createRoute('get', ...args)
  }
  post(...args) {
    return this.createRoute('post',...args)
  }
  put(...args) {
    return this.createRoute('put',...args)
  }
  delete(...args) {
    return this.createRoute('delete',...args)
  }
  group(path, callback) {
    const group = new RouteGroup(path, callback, this.middlewares)
    this.routes.push(group)
    return group
  }
  loadRoutes() {
    this.callback.call(this)
  }
  middleware(middleware){
    if(middleware.prototype instanceof Middleware)
      this.middlewares.push(middleware)
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

  constructor(app, path = '', callback = () => {}, middlewares = []) {
    super(path, callback, middlewares)
    this.app = app
  }

  registerRoutes(app) {
    for (let route of this.routes) {
      if (route instanceof Route) {
        const { path, controller, action, method } = route
        const middlewareHandlers = route.middlewares.map((middleware) =>  new middleware().getExpressHandler())
        app[method](this.path + path, ...middlewareHandlers, (req, res) => {
          const controllerInstance = new controller(req.request, res)
          return controllerInstance.handleRequest(action)
        })
      } else if (route instanceof RouteGroup) {
        const router = new Router(app, this.path + route.path, route.callback, route.middlewares)
        router.loadRoutes()
        router.registerRoutes(app)
      }
    }
  }

  async discoverRoutes() {
    /**read all files and sub files in routes */
    // eslint-disable-next-line no-undef
    const normalizedPath = path.resolve("src/Routes")
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
      module.default(this)
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
  constructor(path, controller, action, method, middlewares = []) {
    this.path = path
    this.controller = controller
    this.action = action
    this.method = method
    this.middlewares = middlewares
  }

  middleware(middleware){
    if(middleware.prototype instanceof Middleware)
      this.middlewares.push(middleware)
    return this
  }
}