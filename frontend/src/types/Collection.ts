import type { Product } from './Product'
import type { Upload } from './Upload'
import type {Suggestion} from "@/types/Suggestion";

export interface Collection extends Suggestion {
    published: boolean
    promoted: boolean
    createdAt: string
    updatedAt: string
    Products: Product[]
    image: Upload
}
