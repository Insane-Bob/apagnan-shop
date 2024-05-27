import { Controller } from '../../Core/Controller.js'
import {Database} from "../../Models/index.js";

export class CustomerController extends Controller {

    async index(){
        const customers = await Database.getInstance().models.Customer.findAll()
        this.res.json({
            customers: customers
        })
    }
    show(){
        this.res.json({
            customer: this.customer
        })
    }
    store(){
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
