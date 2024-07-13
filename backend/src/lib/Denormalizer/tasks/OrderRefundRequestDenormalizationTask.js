import { Schema } from 'mongoose'
import { Database } from '../../../Models/index.js'
import { DenormalizerTask } from '../DenormalizerTask.js'

export class OrderRefundRequestDenormalizationTask extends DenormalizerTask {
    static schema = new Schema({
        id: Number,
        reason: String,
        approved: Boolean,
        createdAt: Date,
        Order: {
            id: Number,
            createdAt: Date,
            Customer: {
                stripeId: String,
                User: {
                    id: Number,
                    firstName: String,
                    lastName: String,
                    email: String,
                    phone: String,
                },
            },
        },
    })

    constructor() {
        super()
        this.in('refundRequests')
    }

    fetch(refundRequestsIds) {
        return Database.getInstance()
            .models.RefundRequestOrder.unscoped()
            .findAll({
                where: {
                    id: refundRequestsIds,
                },
                attributes: ['id', 'reason', 'approved', 'createdAt'],
                include: {
                    model: Database.getInstance().models.Order.unscoped(),
                    attributes: ['id', 'createdAt'],
                    include: {
                        model: Database.getInstance().models.Customer.unscoped(),
                        attributes: ['stripeId'],
                        include: {
                            model: Database.getInstance().models.User.unscoped(),
                            attributes: ['id', 'firstName', 'lastName'],
                        },
                    },
                },
            })
    }
}
