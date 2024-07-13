import { Schema } from 'mongoose'

export const schema = new Schema({
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

/**
 *
 * @param mongoose {Mongoose}
 * @returns {*}
 */
export default function (mongoose) {
    return mongoose.model('Refunds', schema)
}
