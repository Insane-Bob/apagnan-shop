export interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string | null
    role: string | null
    emailVerifiedAt: string | null
    createdAt: string
    updatedAt: string
}
