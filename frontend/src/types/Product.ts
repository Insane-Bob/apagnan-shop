import type { Review } from './Review'
import type { Upload } from './Upload'
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
    images: Upload[]
    reviews: Review[]
}
