import dotenv from 'dotenv'
import path from 'path'
dotenv.config({
    path: path.resolve('.env'),
})
import express from 'express'
import cors from 'cors'
import { AuthMiddleware } from './Http/Middlewares/AuthMiddleware.js'
import { Router } from './Core/Router.js'
import { UploadMiddleware } from './Http/Middlewares/multer.js'

async function setUpApp() {
    console.time('Server started in')

    const app = express()
    app.use(express.raw({ type: 'application/json' }))
    app.use(cors())

    const router = new Router(app)
    await router
        .middleware(AuthMiddleware)
        .middleware(UploadMiddleware)
        .init(app)

    app.all('*', (req, res) => {
        res.status(405).json({ code: 405, message: 'not implemented' })
    })

    console.timeEnd('Server started in')
    return app
}
export default setUpApp
