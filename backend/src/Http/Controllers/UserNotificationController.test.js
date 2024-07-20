import request from 'supertest'
import setUpApp from '../../app.js'
import { Database } from '../../Models/index.js'
import { useFreshDatabase } from '../../tests/databaseUtils.js'
import { UserFactory } from '../../database/factories/UserFactory.js'
import { actingAs } from '../../tests/authTestUtils.js'
import { NotificationSubscriptionType } from '../../Enums/NotificationSubscriptionType.js'
import { CollectionFactory } from '../../database/factories/CollectionFactory.js'
import { ProductFactory } from '../../database/factories/ProductFactory.js'

let app = null
let user = null

describe('NewsletterController test routes', () => {
    let productToToggle = null
    useFreshDatabase(async () => {
        user = await UserFactory.create()
    })
    beforeEach(async () => {
        app = await setUpApp()
    })

    function getNotificationPrefrences() {
        return request(app)
            .get(`/api/users/${user.id}/notifications`)
            .set('Accept', 'application/json')
    }

    test('GET /api/users/:userId/notifications - from another user => 403', async () => {
        const otherUser = await UserFactory.create()
        actingAs(otherUser)
        const response = await getNotificationPrefrences()
        expect(response.statusCode).toBe(403)
    })

    test('GET /api/users/:userId/notifications - get user notifications => no subscription', async () => {
        actingAs(user)
        const response = await getNotificationPrefrences()
        expect(response.statusCode).toBe(200)
        for (let prop in response.body) {
            expect(response.body[prop].active).toBe(false)
        }
    })

    test('GET /api/users/:userId/notifications - get user notifications => with subscription', async () => {
        actingAs(user)
        let collection = await CollectionFactory.create()
        let product = await ProductFactory.create({
            collectionId: collection.id,
        })
        await Database.getInstance().models.UserNotificationSubscription.create(
            {
                userId: user.id,
                modelId: collection.id,
                modelType: 'collection',
                type: NotificationSubscriptionType.NEW_PRODUCT,
                activated: true,
            },
        )

        await Database.getInstance().models.UserNotificationSubscription.create(
            {
                userId: user.id,
                modelId: product.id,
                modelType: 'product',
                type: NotificationSubscriptionType.PRODUCT_RESTOCK,
                activated: true,
            },
        )

        const response = await getNotificationPrefrences()
        expect(response.statusCode).toBe(200)

        expect(
            response.body[NotificationSubscriptionType.NEW_PRODUCT].active,
        ).toBe(true)

        expect(
            response.body[NotificationSubscriptionType.PRODUCT_RESTOCK].active,
        ).toBe(true)
    })

    test('POST /api/users/:userId/notifications - toggle user notifications => create subscription', async () => {
        actingAs(user)
        productToToggle = await ProductFactory.create()

        const response = await request(app)
            .post(
                `/api/users/${user.id}/notifications/${NotificationSubscriptionType.PRODUCT_RESTOCK}`,
            )
            .send({
                modelId: productToToggle.id,
                modelType: 'product',
                activated: true,
            })
            .set('Accept', 'application/json')

        expect(response.statusCode).toBe(201)

        const response2 = await getNotificationPrefrences()

        expect(response2.statusCode).toBe(200)
        expect(
            response2.body[NotificationSubscriptionType.PRODUCT_RESTOCK].active,
        ).toBe(true)

        expect(
            response2.body[NotificationSubscriptionType.PRODUCT_RESTOCK]
                .activatedCount,
        ).toBe(2)
    })

    test('POST /api/users/:userId/notification/:type - toggle user notifications => update subscription', async () => {
        actingAs(user)

        const response = await request(app)
            .post(
                `/api/users/${user.id}/notifications/${NotificationSubscriptionType.PRODUCT_RESTOCK}`,
            )
            .send({
                modelId: productToToggle.id,
                modelType: 'product',
                activated: false,
            })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(200)

        const response2 = await getNotificationPrefrences()
        expect(response2.statusCode).toBe(200)

        expect(
            response2.body[NotificationSubscriptionType.PRODUCT_RESTOCK].active,
        ).toBe(true)

        expect(
            response2.body[NotificationSubscriptionType.PRODUCT_RESTOCK]
                .activatedCount,
        ).toBe(1)
    })

    test('POST /api/users/:userId/notification/:type - global', async () => {
        actingAs(user)

        const response = await request(app)
            .post(
                `/api/users/${user.id}/notifications/${NotificationSubscriptionType.NEW_PRODUCT}`,
            )
            .send({
                activated: false,
            })
            .set('Accept', 'application/json')

        expect(response.statusCode).toBe(200)

        const response2 = await getNotificationPrefrences()
        expect(response2.statusCode).toBe(200)
        expect(
            response2.body[NotificationSubscriptionType.NEW_PRODUCT].active,
        ).toBe(false)
    })
})
