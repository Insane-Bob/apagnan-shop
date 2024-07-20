export interface Review {
    id: number
    rate: number
    content: string
    approved: boolean
    productId: number
    userId: number
    updatedAt: string
    createdAt: string
    Product: { id: number; name: string; slug: string }
    User: { id: number; email: string; firstName: string; lastName: string }
}
