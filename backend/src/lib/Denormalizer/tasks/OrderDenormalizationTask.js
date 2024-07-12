import { DenormalizerTask } from '../DenormalizerTask.js'
import { Database } from '../../../Models/index.js'
import { Schema } from 'mongoose'
export class OrderDenormalizationTask extends DenormalizerTask {
    static schema = new Schema({
        id: Number,
        status: String,
        total: Number,
        Customer: {
            stripeId: String,
            User: {
                id: Number,
                firstName: String,
                lastName: String,
            },
        },
        Details: [
            {
                product: String,
                unitPrice: Number,
                quantity: Number,
                total: Number,
            },
        ],
    })

    constructor() {
        super()
        this.in('orders')
    }

    async persist(model, instance) {
        const exists = await model.findOne({ id: instance.id })
        if (exists) delete instance.Details
        await model.findOneAndUpdate(
            { id: instance.id },
            { $set: instance },
            { upsert: true },
        )
    }

    async fetch(ordersIds) {
        let orders = await Database.getInstance().models.Product.findAll({
            where: {
                id: productsIds,
            },
            attributes: ['id', 'status'],
            include: [
                {
                    model: Database.getInstance().models.Customer,
                    attributes: ['stripeId'],
                    include: {
                        model: Database.getInstance().models.User,
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                },
                {
                    model: Database.getInstance().models.OrderDetail,
                    attributes: ['unitPrice', 'quantity'],
                    include: {
                        model: Database.getInstance().models.Product,
                        attributes: ['name'],
                    },
                },
            ],
        })

        return orders.map((order) => {
            order.Details = order.OrderDetails.map((detail) => ({
                product: detail.Product.name,
                unitPrice: detail.unitPrice,
                quantity: detail.quantity,
                total: detail.unitPrice * detail.quantity,
            }))

            order.total = order.Details.reduce(
                (acc, detail) => acc + detail.total,
                0,
            )
        })
    }
}
