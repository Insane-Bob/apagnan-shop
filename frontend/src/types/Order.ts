import type { Address } from './Address'
import type { Customer } from './Customer'
import type { OrderDetails } from './OrderDetails'
import type { OrderStatus } from './OrderStatus'

export interface Order {
    total: number
    id: number
    customerId: number
    createdAt: string
    shippingAddressId: number
    billingAddressId: number
    status: OrderStatus
    updatedAt: string
    orderDetails: OrderDetails[]
    billing_address: Address
    shipping_address: Address
    customer: Customer
}
