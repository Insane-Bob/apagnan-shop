export interface Product {
    id: number
    name: string
    slug: string
    description: string
    price: number
    published: boolean
    createdAt: string
    updatedAt: string
    deletedAt: string
    collectionId: number
    stock: number
}
