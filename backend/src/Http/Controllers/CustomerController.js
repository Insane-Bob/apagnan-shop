import { Controller } from '../../Core/Controller.js'
import {Database} from "../../Models/index.js";
import {CustomerPolicy} from "../Policies/CustomerPolicy.js";

export class CustomerController extends Controller {
    show(){
        this.can(CustomerPolicy.show, this.customer)
        this.res.json({
            customer: this.customer
        })
    }
    store(){
        this.can(CustomerPolicy.store)
        this.res.json({
            message: 'Store'
        })
    }
    update(){
        this.can(CustomerPolicy.update, this.customer)
        this.res.json({
            message: 'Update'
        })
    }

    delete(){
        this.can(CustomerPolicy.delete, this.customer)
        this.res.json({
            message: 'Delete'
        })
    }
}
