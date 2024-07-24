import {RequestHandler} from "./RequestHandler.js";

export class Middleware extends RequestHandler{
    use = null
    handle(request,response,next){
        next()
    }

    getExpressHandler(){
        if(this.use)
            return this.use
        return (req,res,next) => {
            this.req = req.request //provided by middleware in router init
            this.res = res
            return this.handleRequest('handle',this.req,this.res,next)
        }
    }
}