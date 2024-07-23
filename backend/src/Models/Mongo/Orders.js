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


/**
 *
 * @param mongoose {Mongoose}
 * @returns {*}
 */
export default function (mongoose) {
    const model = mongoose.model('Orders', schema)
    model.searchAttributes = [
        { name : "status"},
        { name : "Customer.User.firstName"},
        { name : "Customer.User.lastName"},
    ]
    model.createIndexes()
    return model
}
