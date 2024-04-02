import fs from 'fs'
import path from 'path'

export class RouteGroup {
  constructor(path, callback) {
    this.path = path
    this.callback = callback
    this.routes = []
  }

  get(path, controller, action) {
    this.routes.push(new Route(path, controller, action, 'get'))
  }
  post(path, controller, action) {
    this.routes.push(new Route(path, controller, action, 'post'))
  }
  put(path, controller, action) {
    this.routes.push(new Route(path, controller, action, 'put'))
  }
  delete(path, controller, action) {
    this.routes.push(new Route(path, controller, action, 'delete'))
  }
  group(path, callback) {
    const group = new RouteGroup(path, callback)
    callback.call(group)
    this.routes.push(group)
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

  constructor(app, path = '', callback = () => {}) {
    super(path, callback)
    this.app = app
  }

  registerRoutes(app) {}

  async discoverRoutes() {
    /**read all files and sub files in routes */
    const normalizedPath = path.join(__dirname, '/App/routes')
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

  init(app) {
    this.discoverRoutes()
    this.registerRoutes(app)
  }
}

export class Route {
  constructor(path, controller, action, method) {
    console.log(path)
    this.path = path
    this.controller = controller
    this.action = action
    this.method = method
  }
}
