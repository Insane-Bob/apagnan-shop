import {Middleware} from "../../Core/Middleware.js";
import throttle from "express-throttle"
export class ThrottleMiddleware extends Middleware{
    constructor() {
        super();
        this.use = throttle({ "burst": 10, period:"3s" })
    }

}