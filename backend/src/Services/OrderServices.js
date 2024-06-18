import { Order } from '../Models/order.js'
import { Database } from '../Models/index.js'
import { PaymentStatus } from '../Models/payment.js'
export class OrderServices {
    constructor(order) {
        if (!order || !(order instanceof Order))
            throw new Error('Invalid order')
        this.order = order
    }

    get total() {
        return 2000
        return this.order.total
    }

    getItems() {
        return this.order.getOrderDetails()
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
        // @TODO : Implement this method
        return [
            {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: 'T-shirt',
                    },
                    unit_amount: 2000,
                },
                quantity: 1,
            },
        ]
    }

    static retrieveOrderById(orderId) {
        return Database.getInstance().models.Order.findByPk(orderId)
    }
}
