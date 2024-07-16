import {RequestHandler} from "./RequestHandler.js";
import {Request} from "./Request.js";

export class Middleware extends RequestHandler{
    // eslint-disable-next-line no-unused-vars
    handle(request,response,next){
        next()
    }

    getExpressHandler(){
        return (req,res,next) => {
            this.req = req.request //provided by middleware in router init
            this.res = res
            return this.handleRequest('handle',this.req,this.res,next)
        }
    }
}