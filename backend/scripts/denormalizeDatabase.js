import { Database } from '../src/Models/index.js'
import { ProductDenormalizationTask } from '../src/lib/Denormalizer/tasks/ProductDenormalizationTask.js'
import { OrderDenormalizationTask } from '../src/lib/Denormalizer/tasks/OrderDenormalizationTask.js'
import { UserSearchDenormalizationTask } from '../src/lib/Denormalizer/tasks/UserSearchDenormalizationTask.js'
import { OrderRefundRequestDenormalizationTask } from '../src/lib/Denormalizer/tasks/OrderRefundRequestDenormalizationTask.js'

async function main() {
    await Database.initialize()
    let db = Database.getInstance()
    db.sequelize.options.logging = false

    let tasks = null

    let productsIds = await db.models.Product.findAll({
        attributes: ['id'],
    })

    tasks = productsIds.map((productId) => {
        return new ProductDenormalizationTask().execute(productId)
    })

    await Promise.all(tasks)

    let ordersIds = await db.models.Order.findAll({
        attributes: ['id'],
    })

    tasks = ordersIds.map((orderId) => {
        return new OrderDenormalizationTask().execute(orderId)
    })

    await Promise.all(tasks)

    let usersIds = await db.models.User.findAll({
        attributes: ['id'],
    })

    tasks = usersIds.map((userId) => {
        return new UserSearchDenormalizationTask().execute(userId)
    })

    await Promise.all(tasks)

    let refundsIds = await db.models.RefundRequestOrder.findAll({})

    tasks = refundsIds.map((refundId) => {
        return new OrderRefundRequestDenormalizationTask().execute(refundId)
    })

    await Promise.all(tasks)

    await Database.close()
    process.exit(0)
}

main()
