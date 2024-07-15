<script setup lang="ts">
import {
Sheet,
SheetContent,
SheetTrigger
} from '@/components/ui/sheet';

import AuthDrawer from '../Drawers/AuthDrawer.vue'

import { computed, ref } from 'vue'
import MobileMenu from '@components/mobile/MobileMenu.vue'

import { useUserStore } from '@store/user'

const user = useUserStore()

const isLogged = computed(() => user.isAuthenticated)

const menuMobileOpen = ref(false)


</script>

<template>
    <header
        class="main-header relative top-0 h-24 bg-white w-full z-40 flex justify-end items-center px-4 md:px-20  border-b border-primary/50"
    >
        <RouterLink to="/">
            <img
                class="absolute right-1/2 translate-x-1/2 top-1/2 -translate-y-1/2 h-full pt-4"
                src="/src/assets/logo_black.svg"
                alt="Apagnain Logo"
            />
        </RouterLink>
        <nav class="flex justy-center gap-x-6 items-center">
            <Sheet v-if="!isLogged">
                <SheetTrigger as-child >
                    <ion-icon 
                        name="log-in-outline"
                        class="header-icon text-black text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"
                    ></ion-icon>
                </SheetTrigger>
                <SheetContent><AuthDrawer></AuthDrawer></SheetContent>
            </Sheet>

        </nav>
    </header>
    <MobileMenu :isOpen="menuMobileOpen" @close="menuMobileOpen = false" />
</template>
