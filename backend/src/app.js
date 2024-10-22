import dotenv from 'dotenv'
import path from 'path'
dotenv.config({
    path: path.resolve('.env'),
})
import express from 'express'
import cors from 'cors'
import { AuthMiddleware } from './Http/Middlewares/AuthMiddleware.js'
import { Router } from './Core/Router.js'
import { ThrottleMiddleware } from './Http/Middlewares/ThrottleMiddleware.js'
import { setConsoleForTest } from './tests/databaseUtils.js'

async function setUpApp() {
    setConsoleForTest()

    console.time('Server started in')

    const app = express()
    app.use(express.raw({ type: 'application/json' }))
    app.use(cors())

    const router = new Router(app)
    await router
        .middleware(AuthMiddleware)
        .middleware(ThrottleMiddleware, 200)
        .init(app)

    app.all('*', (req, res) => {
        res.status(405).json({ code: 405, message: 'method not allowed' })
    })

    console.timeEnd('Server started in')
    return app
}
export default setUpApp
