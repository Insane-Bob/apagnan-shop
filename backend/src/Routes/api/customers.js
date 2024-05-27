import {CustomerController} from "../../Http/Controllers/CustomerController.js";
/**
 * Auth routes
 * @param {Router} router
 */
export default function (router) {
    router.group("/api/customers", function() {
        this.post('/', CustomerController, 'store')
        this.get('/', CustomerController, 'index')
        this.get('/:id', CustomerController, 'show')
        this.put('/:id', CustomerController, 'update')
    })
}
