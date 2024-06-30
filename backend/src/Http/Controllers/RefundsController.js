import { Controller } from '../../Core/Controller.js'
import { PaymentServices } from '../../Services/PaymentServices.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'
import { RefundPolicy } from '../Policies/RefundPolicy.js'
import { Database } from '../../Models/index.js'
import { SearchRequest } from '../../lib/SearchRequest.js'

export class RefundsController extends Controller {
    refund_request
    async index() {
        this.can(RefundPolicy.index)
        let search = new SearchRequest(this.req, ['approved', 'orderId'])
        const refunds =
            await Database.getInstance().models.RefundRequestOrder.findAll(
                search.query,
            )

        this.res.json(refunds)
    }

    async show() {
        this.can()

        const authCustomer = await this.req.getUser().getCustomer()
        const order = await this.refund_request.getOrder()
        this.can(RefundPolicy.show, authCustomer, order)

        this.res.json(this.refund_request)
    }

    async approve() {
        this.can(RefundPolicy.approve)
        const refund = await PaymentServices.createRefund(this.refund_request)
        const customer = await this.refund_request.getCustomer()

        await NotificationsServices.notifyRefundApproved(customer, refund)

        this.res.status(201).json({
            message: 'Refund approved',
            refund: {
                id: refund.id,
            },
        })
    }
}
