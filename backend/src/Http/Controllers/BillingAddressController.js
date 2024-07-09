import { Controller } from '../../Core/Controller.js'
import { UserPolicy } from '../Policies/UserPolicy.js'
import { BillingAddressValidator } from '../../Validator/BillingAddressValidator.js'
import { Database } from '../../Models/index.js'
import { BillingAddressPolicy } from '../Policies/BillingAddressPolicy.js'
import { USER_ROLES } from '../../Models/user.js'
import { SearchRequest } from '../../lib/SearchRequest.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'

export class BillingAddressController extends Controller {
    user_resource /** @provide by UserProvider */
    customer /** @provide by CustomerProvider */
    billing_address /** @provide by BillingAddressProvider */
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
        const billingAddresses =
            await Database.getInstance().models.BillingAddress.findAll(
                search.query,
            )
        this.res.json(billingAddresses)
    }
    show() {
        this.can(BillingAddressPolicy.show, this.billing_address)
        this.res.json(this.billing_address)
    }
    async store() {
        const payload = this.validate(
            BillingAddressValidator,
            BillingAddressValidator.create(),
        )
        this.can(BillingAddressPolicy.create, payload.customerId)

        await Database.getInstance().models.BillingAddress.create(payload)
        this.res.sendStatus(201)
    }
    async update() {
        this.can(BillingAddressPolicy.show, this.billing_address)
        const payload = this.validate(
            BillingAddressValidator,
            BillingAddressValidator.update(),
        )
        const rowsEdited = await this.billing_address.update(payload)
        NotFoundException.abortIf(!rowsEdited)
        this.res.sendStatus(200)
    }

    async delete() {
        this.can(BillingAddressPolicy.show, this.billing_address)
        const success = await this.billing_address.destroy()
        NotFoundException.abortIf(!success)
        this.res.sendStatus(200)
    }
}
