import express from "express";
import {initDatabase} from "./Models/index.js";
import {AuthMiddleware} from "./Http/Middlewares/AuthMiddleware.js";
import {Router} from "./Core/Router.js";

async function setUpApp(){
    const app = express()
    const router = new Router(app)
    await initDatabase()
    app.use(express.json())
    router
        .middleware(AuthMiddleware)
        .init(app)

    return app
}
export default setUpApp