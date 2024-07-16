export class OrderStatus {
    static PENDING = 'pending'
    static PAID = 'paid'
    static PAYMENT_FAILED = 'payment_failed'
    static PROCESSING = 'processing'
    static SHIPPED = 'shipped'
    static DELIVERED = 'delivered'
    static REFUNDED = 'refunded'
    static CANCELLED = 'cancelled'

    static isValid(status) {
        return Object.values(OrderStatus).includes(status)
    }
}
