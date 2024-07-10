import { Controller } from '../../Core/Controller.js'
import { UserPolicy } from '../Policies/UserPolicy.js'
import { AddressValidator } from '../../Validator/AddressValidator.js'
import { Database } from '../../Models/index.js'
import { AddressPolicy } from '../Policies/AddressPolicy.js'
import { USER_ROLES } from '../../Models/user.js'
import { SearchRequest } from '../../lib/SearchRequest.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'

export class AddressController extends Controller {
    user_resource /** @provide by UserProvider */
    customer /** @provide by CustomerProvider */
    address /** @provide by AddressProvider */
    userContext

    beforeEach() {
        this.userContext = this.user_resource || this.req.getUser()
    }

    async index() {
        this.can(UserPolicy.show, this.userContext)

        if (this.customer) this.req.query.set('customerId', this.customer.id)
        if (!this.req.getUser().hasRole(USER_ROLES.ADMIN))
            this.req.query.set('customerId', this.req.getUser().customer.id)

        const search = new SearchRequest(this.req, ['customerId'])
        const Addresses = await Database.getInstance().models.Address.findAll(
            search.query,
        )
        this.res.json(Addresses)
    }
    show() {
        this.can(AddressPolicy.show, this.address)
        this.res.json(this.address)
    }
    async store() {
        const payload = this.validate(
            AddressValidator,
            AddressValidator.create(),
        )
        this.can(AddressPolicy.create, payload.customerId)

        await Database.getInstance().models.Address.create(payload)
        this.res.sendStatus(201)
    }
    async update() {
        this.can(AddressPolicy.show, this.address)
        const payload = this.validate(
            AddressValidator,
            AddressValidator.update(),
        )
        const rowsEdited = await this.address.update(payload)
        NotFoundException.abortIf(!rowsEdited)
        this.res.sendStatus(200)
    }

    async delete() {
        this.can(AddressPolicy.show, this.address)
        const success = await this.address.destroy()
        NotFoundException.abortIf(!success)
        this.res.sendStatus(200)
    }
}
