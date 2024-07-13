import { Schema } from 'mongoose'
import { UserSearchDenormalizationTask } from '../../lib/Denormalizer/tasks/UserSearchDenormalizationTask.js'
import { OrderDenormalizationTask } from '../../lib/Denormalizer/tasks/OrderDenormalizationTask.js'
import { ProductDenormalizationTask } from '../../lib/Denormalizer/tasks/ProductDenormalizationTask.js'

export const schema = new Schema({
    id: Number,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    Customer: {
        stripeId: String,
        Addresses: [
            {
                id: Number,
                street: String,
                city: String,
                region: String,
                postalCode: String,
                country: String,
            },
        ],
    },
})

schema.index({
    firstName: 'text',
    lastName: 'text',
    email: 'text',
    phone: 'text',
})

/**
 *
 * @param mongoose {Mongoose}
 * @returns {*}
 */
export default function (mongoose) {
    const model = mongoose.model('Users', schema)
    model.createIndexes()
    return model
}
