export interface Promo {
    id: number
    value: number
    type: string
    code: string
    stripeId: string
    promoted: boolean
    available: boolean
}
