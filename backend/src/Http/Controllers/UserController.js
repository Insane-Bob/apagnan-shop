import { Controller } from '../../Core/Controller.js'
import {Database} from "../../Models/index.js";
import crypto from "crypto";
export class UserController extends Controller {

    async index(){
        const users = await Database.getInstance().models.User.findAll()
        this.res.json({
            users
        })
    }
    async show(){
        this.res.json({
            user: this.user_resource
        })
    }
    store(){
        console.log(this.req.body)
        this.res.json({
            message: 'Store'
        })
    }
    update(){
        this.res.json({
            message: 'Update'
        })
    }

    delete(){
        this.res.json({
            message: 'Delete'
        })
    }
}
