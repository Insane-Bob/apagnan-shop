import type { User } from './User'

export interface Customer {
    createdAt: Date
    id: number
    stripeId: string
    updatedAt: Date
    userId: number
    user: User
}
