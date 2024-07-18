import { OrderFactory } from '../factories/OrderFactory.js'
import { PaymentStatus } from '../../Models/SQL/payment.js'
import { OrderDenormalizationTask } from '../../lib/Denormalizer/tasks/OrderDenormalizationTask.js'

export default async function () {
    const users = this.references.get('users')
    const products = this.references.get('products')
    for (let user of users) {
        let hasOrder = this.random(1, 0)
        if (!hasOrder) continue
        let customerAdresses = this.references
            .get('addresses')
            .get(user.customer.id)

        let daysAdd = Math.floor(Math.random() * 15) + 1 - 15
        let date = new Date()
        date.setDate(date.getDate() + daysAdd)

        let order = await OrderFactory.count(1)
            .withDetails([
                {
                    productId: this.randomIn(products).id,
                    quantity: this.random(1, 2),
                },
                {
                    productId: this.randomIn(products).id,
                    quantity: this.random(1, 2),
                },
            ])
            .create({
                customerId: user.customer.id,
                billingAddressId: this.randomIn(customerAdresses).id,
                shippingAddressId: this.randomIn(customerAdresses).id,
                createdAt: date,
                updatedAt: date,
            })

        let hasPayment = this.randomIn([true, false])
        if (hasPayment) {
            let statusPayment = this.randomIn([true, false])
                ? PaymentStatus.SUCCEEDED
                : PaymentStatus.FAILED

            await this.db.models.Payment.create({
                sessionId: order.id + 'session',
                orderId: order.id,
                status: statusPayment,
            })

            await this.db.models.OrderStatus.create({
                orderId: order.id,
                status:
                    statusPayment === PaymentStatus.SUCCEEDED
                        ? 'paid'
                        : 'payment_failed',
            })
        }

        await new OrderDenormalizationTask().execute(order)
    }
}
