import type { Review } from './Review'
import type { Upload } from './Upload'
import type {Suggestion} from "@/types/Suggestion";
import type {Collection} from "@/types/Collection";
export interface Product extends Suggestion{
    id: number
    modele: string
    price: number
    priceFormatted:string,
    image: string
    category: string
    createdAt: string
    updatedAt: string
    deletedAt: string
    collectionId: number
    published: boolean
    stock: number
    mainImage: {
        url: string
        uploadId : number
        productId : number
        file: Upload
    }
    images?: {
        url : string
        uploadId : number
        productId : number
        file: Upload
    }[];
    reviews: Review[]
    Collection? : Collection

}
