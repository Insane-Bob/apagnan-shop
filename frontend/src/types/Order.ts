import type { Address } from './Address'
import type { Customer } from './Customer'
import type { OrderDetails } from './OrderDetails'
import type { OrderStatus } from './OrderStatus'
import type { Promo } from './Promo'

export interface Order {
    total: number
    id: number
    customerId: number
    createdAt: string
    shippingAddressId: number
    billingAddressId: number
    statusHistory: [
        {
            id: number
            orderId: number
            status: OrderStatus
            createdAt: string
        },
    ]
    RefundRequestOrders: [
        {
            approved: boolean
        },
    ]
    status: OrderStatus
    updatedAt: string
    orderDetails: OrderDetails[]
    billing_address: Address
    shipping_address: Address
    customer: Customer
    Promo?: Promo
}
