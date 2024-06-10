import { Controller } from '../../Core/Controller.js'
import { UserPolicy } from '../Policies/UserPolicy.js'
import { BillingAddressValidator } from '../../Validator/BillingAddressValidator.js'
import { Database } from '../../Models/index.js'

export class BillingAddressController extends Controller {
    user_resource /** @provide by UserProvider */
    customer /** @provide by CustomerProvider */
    billing_address /** @provide by BillingAddressProvider */
    async index() {
        this.can(UserPolicy.show, this.user_resource)
        this.res.json({
            billing_addresses: await this.customer.getBillingAddresses(),
        })
    }
    show() {
        this.can(UserPolicy.show, this.user_resource)
        this.res.json(this.billing_address)
    }
    async store() {
        this.can(UserPolicy.update, this.user_resource)
        const payload = this.validate(BillingAddressValidator)
        await Database.getInstance().models.BillingAddress.create({
            ...payload,
            customer_id: this.customer.id,
        })
        await this.index()
    }
    async update() {
        this.can(UserPolicy.update, this.user_resource)
        const payload = this.validate(BillingAddressValidator)
        await this.billing_address.update({
            ...payload,
        })
        await this.index()
    }

    async delete() {
        this.can(UserPolicy.update, this.user_resource)
        await this.billing_address.destroy()
        await this.index()
    }
}