import { defineStore } from 'pinia'
import type { BasketItem, User, } from '../types'

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            user: null as User | null,
            cart: [] as BasketItem[],
            newItem: false as Boolean,
        }
    },
    actions: {
        setUser(user: User | null) {
            this.user = user
        },
        setCart(cart: BasketItem[]) {
            this.cart = cart
        },
        clearUser() {
            this.user = null
        },
        clearCart() {
            this.cart = []
        },
        addItemToCart(item: BasketItem) {
            const existingItem = this.cart.find(
                (i) => i.product.id === item.product.id,
            )
            if (existingItem) {
                existingItem.quantity += item.quantity
            } else {
                this.cart.push(item)
            }

            this.newItem = true
        },
        cartViewed() {
            this.newItem = false
        },
    },
    getters: {
        isAuthenticated: (state: any) => !!state.user,
        isAdmin: (state: any) => state.user?.role === 'admin',
        getId: (state: any) => state.user?.id,
        get: (state: any) => state.user,
        getCart: (state: any) => state.cart,
        countCartItem: (state: any) =>
            state.cart.reduce((acc: any, item: any) => acc + item.quantity, 0),
        cartHasNewItems: (state: any) => state.newItem,
    },
})
