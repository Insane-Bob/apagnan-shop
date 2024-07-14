export class OrderStatus {
    static PENDING = 'pending'
    static SHIPPED = 'shipped'
    static DELIVERED = 'delivered'
    static REFUNDED = 'refunded'
    static CANCELLED = 'cancelled'

    static isValid(status) {
        return Object.values(OrderStatus).includes(status)
    }
}
