import { Controller } from '../../Core/Controller.js'
import { UserPolicy } from '../Policies/UserPolicy.js'
import { OrderValidator } from '../../Validator/OrderValidator.js'
import { Database } from '../../Models/index.js'
import { PaymentServices } from '../../Services/PaymentServices.js'
import { AskForRefundValidator } from '../../Validator/AskForRefundValidator.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'
import { OrderPolicy } from '../Policies/OrderPolicy.js'
import { SearchRequest } from '../../lib/SearchRequest.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'
import { USER_ROLES } from '../../Models/user.js'

export class OrderController extends Controller {
    user_resource /** @provide by UserProvider if set */
    customer /** @provide by CustomerProvider if set */
    order /** @provide by OrderProvider */
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
        const orders = await Database.getInstance().models.Order.findAll(
            search.query,
        )
        this.res.json(orders)
    }
    show() {
        this.can(OrderPolicy.show, this.order)
        this.res.json(this.order)
    }
    async store() {
        const payload = this.validate(OrderValidator, OrderValidator.create())
        this.can(OrderPolicy.store, payload.customerId)
        await Database.getInstance().models.Order.create(payload)
        this.res.sendStatus(201)
    }
    async update() {
        this.can(OrderPolicy.show, this.order)
        const payload = this.validate(OrderValidator, OrderValidator.update())
        const rowsEdited = await this.order.update(payload)
        NotFoundException.abortIf(!rowsEdited)
        await this.res.sendStatus(200)
    }

    async pay() {
        this.can(OrderPolicy.show, this.order)
        const session = await PaymentServices.createCheckoutSession(this.order)
        this.res.json(session)
    }

    async askForRefund() {
        this.can(OrderPolicy.show, this.order)
        const payload = this.validate(AskForRefundValidator)
        //@TODO : handle the choice of the items and the quantity to refund
        const refundRequest = await PaymentServices.askForRefund(
            this.order,
            payload.reason,
        )
        const customer = await this.order.getCustomer()
        await NotificationsServices.notifyNewRefundRequest(refundRequest)
        await NotificationsServices.notifyACKRefund(customer, refundRequest)
        this.res.sendStatus(201)
    }
}
