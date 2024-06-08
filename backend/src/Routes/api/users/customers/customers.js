
import {ordersRoutes} from "./orders.js";
import {CustomerProvider} from "../../../../Http/Providers/CustomerProvider.js";
import {CustomerController} from "../../../../Http/Controllers/CustomerController.js";

/**
 * Auth routes
 * @param {Router} router
 */
export function customersRoutes (router) {
    router.group("/:user_resource/customer", function() {
        ordersRoutes(this)
    }).provide(CustomerProvider)
}
