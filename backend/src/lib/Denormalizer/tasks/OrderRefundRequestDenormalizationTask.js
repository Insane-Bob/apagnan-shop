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
            Customer: {
                stripeId: String,
                OUser: {
                    id: Number,
                    firstName: String,
                    lastName: String,
                    email: String,
                    phone: String,
                },
            },
        },
    })

    fetch(refundRequestsIds) {
        return Database.getInstance().models.RefundRequestOrder.findAll({
            where: {
                id: refundRequestsIds,
            },
            attributes: ['id', 'reason', 'approved', 'createdAt'],
            include: {
                model: Database.getInstance().models.Order,
                attributes: ['id'],
                include: {
                    model: Database.getInstance().models.Customer,
                    attributes: ['stripeId'],
                    include: {
                        model: Database.getInstance().models.User,
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                },
            },
        })
    }
}
