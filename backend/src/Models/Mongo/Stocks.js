import { Schema } from 'mongoose'

export const schema = new Schema({
    productId: String,
    date: Date,
    quantityOfDay: Number,
})

/**
 *
 * @param mongoose {Mongoose}
 * @returns {*}
 */
export default function (mongoose) {
    return mongoose.model('Stocks', schema)
}
