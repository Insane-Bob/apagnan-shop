export interface Review {
    id: number
    rate: number
    content: string
    approved: boolean
    productId: number
    userId: number
    updatedAt: string
    createdAt: string
}
