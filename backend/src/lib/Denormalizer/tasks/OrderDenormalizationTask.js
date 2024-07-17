import { DenormalizerTask } from '../DenormalizerTask.js'
import { Database } from '../../../Models/index.js'
import { Schema } from 'mongoose'
export class OrderDenormalizationTask extends DenormalizerTask {
    static model = 'Orders'
    constructor() {
        super()
        this.in('orders')
    }

    async persist(model, instance) {
        const exists = await model.findOne({ id: instance.id })
        let payload = instance.toJSON()
        if (exists) payload.OrderDetails = exists.OrderDetails
        await model.findOneAndUpdate(
            { id: instance.id },
            { $set: payload },
            { upsert: true },
        )
    }

    async fetch(ordersIds) {
        let orders = await Database.getInstance()
            .models.Order.unscoped()
            .findAll({
                where: {
                    id: ordersIds,
                },
                attributes: ['id', 'status', 'paid', 'createdAt'],
                include: [
                    {
                        association: 'statusHistory',
                    },
                    {
                        model: Database.getInstance().models.Payment,
                    },
                    {
                        model: Database.getInstance().models.OrderDetail,
                        attributes: ['unitPrice', 'quantity'],
                        include: {
                            model: Database.getInstance().models.Product,
                            as: 'Product',
                            attributes: ['name'],
                        },
                    },
                    {
                        association: 'Customer',
                        include: [
                            {
                                association: 'User',
                                attributes: ['firstName', 'lastName', 'email'],
                            },
                        ],
                    },
                ],
            })

        return orders.map((order) => {
            order.OrderDetails = order.OrderDetails.map((detail) => ({
                product: detail.Product.name,
                unitPrice: detail.unitPrice,
                quantity: detail.quantity,
                total: detail.unitPrice * detail.quantity,
            }))

            order.total = order.OrderDetails.reduce(
                (acc, detail) => acc + detail.total,
                0,
            )
            return order
        })
    }
}
