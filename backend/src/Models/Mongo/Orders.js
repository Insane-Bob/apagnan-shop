import { Schema } from 'mongoose'
import { OrderDenormalizationTask } from '../../lib/Denormalizer/tasks/OrderDenormalizationTask.js'
import { ProductDenormalizationTask } from '../../lib/Denormalizer/tasks/ProductDenormalizationTask.js'

export const schema = new Schema({
    id: Number,
    status: String,
    total: Number,
    createdAt: Date,
    Customer: {
        stripeId: String,
        User: {
            id: Number,
            firstName: String,
            lastName: String,
        },
    },

    OrderDetails: [
        {
            product: String,
            unitPrice: Number,
            quantity: Number,
            total: Number,
        },
    ],
})
schema.index({
    status: 'text',
    'Customer.User.firstName': 'text',
    'Customer.User.lastName': 'text',
})

/**
 *
 * @param mongoose {Mongoose}
 * @returns {*}
 */
export default function (mongoose) {
    const model = mongoose.model('Orders', schema)
    model.createIndexes()
    return model
}
