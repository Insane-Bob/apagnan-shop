import { Schema } from 'mongoose'

export const schema = new Schema({
    id: Number,
    status: String,
    paid: Boolean,
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
