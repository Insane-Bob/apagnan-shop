import { Schema } from 'mongoose'
import { ProductDenormalizationTask } from '../../lib/Denormalizer/tasks/ProductDenormalizationTask.js'

export const schema = new Schema({
    id: Number,
    slug: String,
    name: String,
    description: String,
    price: Number,
    published: Boolean,
    Reviews: [
        {
            id: Number,
            rate: Number,
            content: String,
            createdAt: Date,
            User: {
                id: Number,
                firstName: String,
                lastName: String,
            },
        },
    ],
    Collection: {
        id: Number,
        name: String,
        slug: String,
        description: String,
        published: Boolean,
        promoted: Boolean,
    },
    Specifics: [
        {
            id: Number,
            name: String,
            content: String,
        },
    ],
})
/**
 *
 * @param mongoose {Mongoose}
 * @returns {*}
 */
export default function (mongoose) {
    const model = mongoose.model('Products', schema)
    model.searchAttributes = [
        {
            name: 'name',
        },
        {
            name: 'description',
        },
        {
            name: 'Collection.name',
        },
        {
            name: 'Collection.description',
        },
        {
            name: 'Specifics.content',
        }
    ]
    model.createIndexes()
    return model
}
