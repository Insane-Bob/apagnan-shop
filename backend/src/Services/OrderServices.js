import { Order } from '../Models/SQL/order.js'
import { Database } from '../Models/index.js'
import { PaymentStatus } from '../Models/SQL/payment.js'
import { OrderStatus } from '../Enums/OrderStatus.js'
import { OrderDenormalizationTask } from '../lib/Denormalizer/tasks/OrderDenormalizationTask.js'
export class OrderServices {
    constructor(order) {
        if (!order || !(order instanceof Order))
            throw new Error('Invalid order')
        this.order = order
    }

    get total() {
        return this.order.total
    }

    getCustomer() {
        return this.order.getCustomer()
    }

    async getLastSuccessPayment() {
        const payments = await this.order.getPayments({
            limit: 1,
            order: [['createdAt', 'DESC']],
            where: {
                status: PaymentStatus.SUCCEEDED,
            },
        })
        return payments.length ? payments[0] : null
    }

    async getLastPayment() {
        let payments = await this.order.getPayments({
            limit: 1,
            order: [['createdAt', 'DESC']],
        })
        return payments.length ? payments[0] : null
    }

    async getStripeLineItems() {
        let orderDetails = this.order.OrderDetails
        if (!orderDetails) {
            orderDetails = await this.order.getOrderDetails()
        }

        return await Promise.all(
            orderDetails.map(async (orderDetail) => {
                const productName =
                    await Database.getInstance().models.Product.findByPk(
                        orderDetail.productId,
                        {
                            attributes: ['name'],
                        },
                    )
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: productName.name,
                        },
                        unit_amount: Number(orderDetail.unitPrice) * 100,
                    },
                    quantity: orderDetail.quantity,
                }
            }),
        )
    }

    static retrieveOrderById(orderId) {
        return Database.getInstance().models.Order.findByPk(orderId)
    }

    async setStatus(status, options, denormalize = true) {
        if (!OrderStatus.isValid(status)) return
        let s = await Database.getInstance().models.OrderStatus.create(
            {
                createdAt: new Date(),
                status,
                orderId: this.order.id,
            },
            options,
        )
        this.order.statusHistory.push(s)
        if (denormalize)
            await new OrderDenormalizationTask().execute(this.order)
        return s
    }
}
