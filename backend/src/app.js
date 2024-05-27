import dotenv from "dotenv";
import path from "path";
dotenv.config({
    path: path.resolve(".env")
});
import express from "express";
import {AuthMiddleware} from "./Http/Middlewares/AuthMiddleware.js";
import {Router} from "./Core/Router.js";

async function setUpApp(){
    const app = express()
    const router = new Router(app)
    app.use(express.json())
    router
        .middleware(AuthMiddleware)
        .init(app)

    return app
}
export default setUpApp