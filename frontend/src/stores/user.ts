import { defineStore } from 'pinia'
import type { Address, BasketItem, User } from '../types'

let timeoutHandle: any

export const useUserStore = defineStore('user', {
    state: () => {
        return {
            user: null as User | null,
            cart: [] as BasketItem[],
            newItem: false as boolean,
            addresses: [] as any,
            loggedAs: false as boolean,
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

        setAddresses(adresses: Address[]) {
            this.addresses = adresses
        },
        setLoggedAs(value: boolean) {
            this.loggedAs = value
        },

        logout(){
            this.clearUser()
            this.clearCart()
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
        }
    },
    getters: {
        isAuthenticated: (state: any): boolean => !!state.user,
        isAdmin: (state: any): boolean => state.user?.role === 'admin',
        getId: (state: any): number => state.user?.id,
        get: (state: any): User => state.user,
        getCart: (state: any): BasketItem[] => state.cart,
        countCartItem: (state: any): number =>
            state.cart.reduce((acc: any, item: any) => acc + item.quantity, 0),
        cartHasNewItems: (state: any): boolean => state.newItem,
        getAddresses: (state: any): Address[] => state.addresses,
        getCustomerId: (state: any): number => state.user?.Customer.id,
        identity: (state: any) =>
            state.user?.firstName + ' ' + state.user?.lastName,
        isLoggedAs: (state: any) => state.loggedAs,
    },
})
