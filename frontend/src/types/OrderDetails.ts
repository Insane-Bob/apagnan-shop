import type {Product} from "@/types/Product";

export interface OrderDetails {
    total: number
    id: number
    orderId: number
    productId: number
    unitPrice: string
    createdAt: Date
    updatedAt: Date
    quantity: number
}

export interface OrderDetailsWithProducts extends OrderDetails{
    Product: Product
}
