import { defineStore } from 'pinia'
import type { User } from '../types'

export const useUserStore = defineStore('user', {
    state: () => {
        return { user: null as User | null }
    },
    actions: {
        setUser(user: User | null) {
            console.log('setUser', user)
            this.user = user
            console.log('this.user', this.user)
        },
        clearUser() {
            this.user = null
        },
    },
    getters: {
        isAuthenticated: (state: any) => !!state.user,
        isAdmin: (state: any) => state.user?.role === 'admin',
        getId: (state: any) => state.user?.id,
        get: (state: any) => state.user,
        identity: (state: any) =>
            state.user?.firstName + ' ' + state.user?.lastName,
    },
})
