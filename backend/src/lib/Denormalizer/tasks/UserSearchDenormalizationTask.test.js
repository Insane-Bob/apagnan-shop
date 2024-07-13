/**
 * Ces tests permettent d'assurer la cohérence des données dénormalisées dans la collections Mongo
 * Mongo Collection : products
 */
import {
    useFreshDatabase,
    useFreshMongoDatabase,
} from '../../../tests/databaseUtils.js'
import { UserFactory } from '../../../database/factories/UserFactory.js'
import { DenormalizerQueue } from '../DenormalizerQueue.js'
import { Database } from '../../../Models/index.js'
import { AddressFactory } from '../../../database/factories/AddressFactory.js'

let users
let Users
describe('UserSearchDenormalizationTask', () => {
    const denormalizerQueue = DenormalizerQueue.getInstance()
    denormalizerQueue.enqueue = jest.fn((task) => task.execute())

    useFreshMongoDatabase()
    useFreshDatabase(async () => {
        Users = Database.getInstance().mongoModels.Users
        users = await UserFactory.withCustomer().count(3).create()
        for (let user of users) {
            user.customer = await user.getCustomer()
            user.customer._addresses = await AddressFactory.count(2).create({
                customerId: user.customer.id,
            })
        }
    })

    test('USER creation / update', async () => {
        let randomUserIndex = Math.floor(Math.random() * users.length)
        let user = users[randomUserIndex]

        const mUser = await Users.findOne({
            id: user.id,
        })

        expect(mUser).toBeTruthy()
        expect(mUser.Customer.stripeId).toBe(user.customer.stripeId)

        /**
         * Update
         */

        user.firstName = 'newFirstName'
        denormalizerQueue.enqueue = jest.fn((task) => task.execute())
        await user.save()

        expect(denormalizerQueue.enqueue).toHaveBeenCalled()

        const updatedMUser = await Users.findOne({
            id: user.id,
            firstName: 'newFirstName',
        })

        expect(updatedMUser).toBeTruthy()
    })

    test('Billing Address create / update', async () => {
        let randomUserIndex = Math.floor(Math.random() * users.length)
        let user = users[randomUserIndex]

        const mAddress = await Users.aggregate([
            {
                $match: {
                    id: user.id,
                },
            },
            {
                $unwind: '$Customer.Addresses',
            },
            {
                $replaceRoot: { newRoot: '$Customer.Addresses' },
            },
        ])

        expect(mAddress).toHaveLength(2)

        /**
         * Update
         */

        let randomIndex = Math.floor(Math.random() * mAddress.length)
        let addresses = user.customer._addresses[randomIndex]

        addresses.street = 'newStreet'
        denormalizerQueue.enqueue = jest.fn((task) => task.execute())
        await addresses.save()

        expect(denormalizerQueue.enqueue).toHaveBeenCalled()

        const updatedMAddress = await Users.aggregate([
            {
                $match: {
                    id: user.id,
                },
            },
            {
                $unwind: '$Customer.Addresses',
            },
            {
                $replaceRoot: { newRoot: '$Customer.Addresses' },
            },
            {
                $match: {
                    street: 'newStreet',
                },
            },
        ])
        expect(updatedMAddress).toHaveLength(1)
    })
})
