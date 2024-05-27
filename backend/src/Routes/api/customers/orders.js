import {OrderProvider} from "../../../Http/Providers/OrderProvider.js";
import {OrderController} from "../../../Http/Controllers/OrderController.js";

export function customersOrderRoutes(customerRouterGroup){
    customerRouterGroup.group("/:customer/orders", function() {
        this.get('/:order', OrderController, 'show')
        this.get('/', OrderController, 'index')
        this.post('/', OrderController, 'store')
        this.put('/:order', OrderController, 'update')
        this.delete('/:order', OrderController, 'destroy')
    }).provide(OrderProvider)
}