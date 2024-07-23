import type {Product} from "@/types/Product";

export interface OrderDetails {
    total: number
    totalFormatted:string,
    id: number
    orderId: number
    productId: number
    unitPrice: string
    unitPriceFormatted: string
    createdAt: Date
    updatedAt: Date
    quantity: number
}

export interface OrderDetailsWithProducts extends OrderDetails{
    Product: Product
}
