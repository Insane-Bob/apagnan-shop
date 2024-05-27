import { Controller } from '../../Core/Controller.js'

export class OrderController extends Controller {
    async index(){
        this.res.json({
            orders: await this.customer.getOrders()
        })
    }
    show(){
        this.res.json({
            order: this.order
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
