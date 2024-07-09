import { defineStore } from 'pinia'
import type { BasketItem, User, } from '../types'


let timeoutHandle: any

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
        addItem(cart: BasketItem[]) {
            this.cart = cart

            if (timeoutHandle) {
                window.clearTimeout(timeoutHandle)
            }

            timeoutHandle = window.setTimeout(
                () => {
                    this.clearCart()
                    this.newItem = false
                },
                1000 * 60 * 15,
            )

            this.newItem = true
        },
        cartViewed() {
            this.newItem = false
        },
    },
    getters: {
        isAuthenticated: (state: any) => !!state.user,
        getId: (state: any) => state.user?.id,
        get: (state: any) => state.user,
        getCart: (state: any) => state.cart,
        countCartItem: (state: any) =>
            state.cart.reduce((acc: any, item: any) => acc + item.quantity, 0),
        cartHasNewItems: (state: any) => state.newItem,
    },
})
