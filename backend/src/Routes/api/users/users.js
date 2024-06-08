import {UserProvider} from "../../../Http/Providers/UserProvider.js";
import {UserController} from "../../../Http/Controllers/UserController.js";
import {customersRoutes} from "./customers/customers.js";

/**
 * Auth routes
 * @param {Router} router
 */
export default function (router) {
    router.group("/api/users", function() {
        this.get('/', UserController, 'index')
        this.get('/:user_resource', UserController, 'show')
        this.post('/', UserController, 'store')
        this.put('/:user_resource', UserController, 'update')
        this.delete('/:user_resource', UserController, 'destroy')
        customersRoutes(this)
    }).provide(UserProvider)
}
