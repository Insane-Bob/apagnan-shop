import type { Product } from './Product'
import type { Upload } from './Upload'

export interface Collection {
    id: number
    slug: string
    name: string
    description: string
    published: boolean
    promoted: boolean
    createdAt: string
    updatedAt: string
    Products: Product[]
    image: Upload
}
