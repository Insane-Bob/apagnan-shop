/**
 * Ces tests permettent d'assurer la cohérence des données dénormalisées dans la collections Mongo
 * Mongo Collection : products
 */
import {
    useFreshDatabase,
    useFreshMongoDatabase,
} from '../../../tests/databaseUtils.js'
import { UserFactory } from '../../../database/factories/UserFactory.js'
import { ProductFactory } from '../../../database/factories/ProductFactory.js'
import { ReviewFactory } from '../../../database/factories/ReviewFactory.js'
import { DenormalizerQueue } from '../DenormalizerQueue.js'
import { Database } from '../../../Models/index.js'

let users
let reviews = []
let product
let product2

let Products
describe('ProductDenormalizationTask', () => {
    const denormalizerQueue = DenormalizerQueue.getInstance()
    denormalizerQueue.enqueue = jest.fn((task) => task.execute())

    useFreshMongoDatabase()
    useFreshDatabase(async () => {
        Products = Database.getInstance().mongoModels.Products
        users = await UserFactory.count(3).create()
        let products = await ProductFactory.count(2).create()
        product = products[0]
        product2 = products[1]

        for (let p of products) {
            reviews.push(
                await ReviewFactory.count(1).create({
                    productId: p.id,
                    userId: users[0].id,
                }),
            )
            reviews.push(
                await ReviewFactory.count(1).create({
                    productId: p.id,
                    userId: users[1].id,
                }),
            )
            reviews.push(
                await ReviewFactory.count(1).create({
                    productId: p.id,
                    userId: users[2].id,
                }),
            )
        }
    })

    test('Product edition / creation', async () => {
        const pReviews = await product.getReviews()
        const pCollection = await product.getCollection()
        let mProduct = await Products.findOne({ id: product.id })

        /**
         * CREATION (beforeAll sideEffect)
         */

        expect(mProduct.Reviews.length).toBe(pReviews.length)
        expect(mProduct.Collection.name).toBe(pCollection.name)

        /**
         * EDITION
         */

        product.name = 'New name'

        denormalizerQueue.enqueue = jest.fn(async (task) => {
            await task.execute()
        })

        await product.save()

        expect(denormalizerQueue.enqueue).toHaveBeenCalled()

        mProduct = await Products.findOne({ id: product.id })

        expect(mProduct.name).toBe('New name')
    })

    test('Review edition / creation', async () => {
        let randomReviewIndex = Math.floor(Math.random() * reviews.length)
        let review = reviews[randomReviewIndex]

        let mReview = await Products.aggregate([
            { $unwind: '$Reviews' },
            {
                $match: {
                    'Reviews.content': review.content,
                    'Reviews.rate': review.rate,
                },
            },
            {
                $replaceRoot: {
                    newRoot: '$Reviews',
                },
            },
        ])

        /**
         * CREATION (beforeAll sideEffect)
         */
        expect(mReview.length).toBe(1)

        /**
         * EDITION
         */

        review.content = 'New content'
        denormalizerQueue.enqueue = jest.fn(async (task) => {
            await task.execute()
        })
        review = await review.save()

        expect(denormalizerQueue.enqueue).toHaveBeenCalled()

        mReview = await Products.aggregate([
            { $unwind: '$Reviews' },
            {
                $replaceRoot: {
                    newRoot: '$Reviews',
                },
            },
            {
                $match: {
                    content: 'New content',
                    rate: review.rate,
                },
            },
        ])
        expect(mReview.length).toBe(1)
    })

    test('User edition', async () => {
        let users = await Products.aggregate([
            { $unwind: '$Reviews' },
            { $group: { _id: '$Reviews.User', count: { $sum: 1 } } },
            {
                $project: {
                    _id: 0,
                    User: {
                        firstName: '$_id.firstName',
                        lastName: '$_id.lastName',
                        reviewCount: '$count',
                    },
                },
            },
            {
                $replaceRoot: {
                    newRoot: '$User',
                },
            },
        ])

        let randomUserIndex = Math.floor(Math.random() * users.length)
        let user = users[randomUserIndex]

        let dbUser = await Database.getInstance().models.User.findOne({
            where: {
                firstName: user.firstName,
                lastName: user.lastName,
            },
        })

        dbUser.firstName = 'New name'
        await dbUser.save()

        let mUserReviews = await Products.aggregate([
            { $unwind: '$Reviews' },
            {
                $match: {
                    'Reviews.User.firstName': dbUser.firstName,
                    'Reviews.User.lastName': dbUser.lastName,
                },
            },
        ])

        expect(mUserReviews.length).toBe(user.reviewCount)
    })

    test('Collection edition', async () => {
        let collections =
            await Database.getInstance().models.Collection.findAll({
                limit: 1,
            })
        let collection = collections[0]

        // create Product
        let product3 = await ProductFactory.count(1).create({
            collectionId: collection.id,
        })

        let mCollection = await Products.aggregate([
            {
                $match: {
                    'Collection.slug': collection.slug,
                },
            },
            {
                $group: {
                    _id: '$Collection',
                    productCount: { $sum: 1 },
                },
            },
        ])

        mCollection = mCollection[0]

        expect(mCollection).toBeTruthy()

        collection.name = 'New name'
        await collection.save()

        let mCollectionAfter = await Products.aggregate([
            {
                $match: {
                    'Collection.name': collection.name,
                },
            },
            {
                $group: {
                    _id: '$Collection',
                    productCount: { $sum: 1 },
                },
            },
        ])

        mCollectionAfter = mCollectionAfter[0]

        expect(mCollectionAfter).toBeTruthy()
        expect(mCollectionAfter.productCount).toBe(mCollection.productCount)
    })
})
