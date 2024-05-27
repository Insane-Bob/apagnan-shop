
import {customersOrderRoutes} from "./orders.js";
import {CustomerProvider} from "../../../Http/Providers/CustomerProvider.js";
import {CustomerController} from "../../../Http/Controllers/CustomerController.js";

/**
 * Auth routes
 * @param {Router} router
 */
export default function (router) {
    router.group("/api/customers", function() {
        this.get('/', CustomerController, 'index')
        this.get('/:customer', CustomerController, 'show')
        this.post('/', CustomerController, 'store')
        this.put('/:customer', CustomerController, 'update')
        this.delete('/:customer', CustomerController, 'destroy')
        customersOrderRoutes(this)
    }).provide(CustomerProvider)
}
