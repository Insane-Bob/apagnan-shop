import type { Review } from './Review'
export interface Product {
    id: number
    name: string
    slug: string
    modele: string
    description: string
    price: number
    image: string
    category: string
    createdAt: string
    updatedAt: string
    deletedAt: string
    collectionId: number
    published: boolean
    stock: number
    reviews: Review[]
}
