import {OrderProvider} from "../../../../Http/Providers/OrderProvider.js";
import {OrderController} from "../../../../Http/Controllers/OrderController.js";

export function ordersRoutes(customerRouterGroup){
    customerRouterGroup.group("/orders", function() {
    }).provide(OrderProvider)
}