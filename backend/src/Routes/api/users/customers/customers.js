
import {ordersRoutes} from "./orders.js";
import {CustomerProvider} from "../../../../Http/Providers/CustomerProvider.js";
import {CustomerController} from "../../../../Http/Controllers/CustomerController.js";

/**
 * Auth routes
 * @param {Router} router
 */
export function customersRoutes (router) {
    router.group("/:user_resource/customer", function() {
        this.get('/', CustomerController, 'show')
        this.post('/', CustomerController, 'store')
        this.put('/', CustomerController, 'update')
        this.delete('/', CustomerController, 'destroy')
        ordersRoutes(this)
    }).provide(CustomerProvider)
}
