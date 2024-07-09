import { defineStore } from 'pinia'
import { apiClient } from '@/lib/apiClient'
import type { User } from '../types'
import { computed, reactive, ref } from 'vue'

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
        getId: (state: any) => state.user?.id,
        get: (state: any) => state.user,
    },
})
