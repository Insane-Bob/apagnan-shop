<script setup lang="ts">
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import PromoBanner from '@components/promo/PromoBanner.vue'
import AuthDrawer from '../Drawers/AuthDrawer.vue'
import CartDrawer from '@components/Drawers/CartDrawer.vue'
import { computed, reactive, ref } from 'vue'
import MobileMenu from '@components/mobile/MobileMenu.vue'

import { useUserStore } from '@store/user'

const user = useUserStore()

const promoPromoted = ref(false)

const isLogged = computed(() => user.isAuthenticated)

const search = reactive({
    query: '',
    show: false,
})

const menuMobileOpen = ref(false)

const onOpenBurgerMenu = () => {
    menuMobileOpen.value = !menuMobileOpen.value
}

const onSearch = () => {
    if (!search.show) {
        search.show = true
        return
    }

    alert(`searching for ${search.query}`)
}
</script>

<template>
    <div>
        <div class="taker w-full h-[96px]"></div>
        <PromoBanner class="fixed top-0" @isPromo="promoPromoted = true"/>
        <header
            class="main-header fixed h-24 bg-white w-full z-40 flex justify-end items-center px-4 md:px-20"
            :class="{'top-0': !promoPromoted, 'top-8': promoPromoted}"
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
                    <SheetTrigger as-child>
                        <ion-icon
                            name="log-in-outline"
                            class="header-icon text-black text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"
                        ></ion-icon>
                    </SheetTrigger>
                    <SheetContent><AuthDrawer></AuthDrawer></SheetContent>
                </Sheet>

                <Sheet v-if="isLogged">
                    <SheetTrigger>
                        <div class="relative group">
                            <ion-icon
                                name="cart-outline"
                                class="header-icon text-black text-2xl cursor-pointer group-hover:scale-105 duration-100 hidden md:block"
                            ></ion-icon>
                            <div
                                v-if="user.countCartItem > 0"
                                class="group-hover:scale-105 absolute -top-2 -right-2 bg-red-500 rounded-full text-xs text-white w-4 h-4"
                            >
                                <div
                                    :class="{
                                        'animate-ping': user.cartHasNewItems,
                                        'bg-red-500/20 rounded-full w-4 h-4 absolute': true,
                                    }"
                                ></div>
                                <span class="text-white">{{
                                    user.countCartItem
                                }}</span>
                            </div>
                        </div>
                    </SheetTrigger>
                    <SheetContent><CartDrawer></CartDrawer></SheetContent>
                </Sheet>
                
                <RouterLink to="/admin" class="relative group" v-if="isLogged && user.isAdmin">
                  <ion-icon 
                      name="laptop-outline"
                      class="header-icon text-black text-2xl cursor-pointer group-hover:scale-105 duration-100 hidden md:block"
                  ></ion-icon>
                </RouterLink>

                <RouterLink to="/profile" v-if="isLogged">
                    <button class="flex items-center">
                        <ion-icon
                            name="person-outline"
                            class="header-icon text-black text-2xl cursor-pointer hover:scale-105 duration-100"
                        ></ion-icon>
                    </button>
                </RouterLink>

                <form
                    @submit.prevent="onSearch()"
                    class="flex justify-center items-center -ml-6 gap-2"
                >
                    <input
                        v-model="search.query"
                        type="text"
                        class="rounded-sm duration-300 px-2 py-1 max-w-44"
                        :class="{
                            'w-0 border-0': !search.show,
                            'w-[30vw] border ml-2': search.show,
                        }"
                        placeholder="Search..."
                    />
                    <button class="flex items-center">
                        <ion-icon
                            name="search-outline"
                            class="header-icon text-black text-2xl cursor-pointer hover:scale-105 duration-100"
                        ></ion-icon>
                    </button>
                </form>
                <div
                    @click="onOpenBurgerMenu()"
                    class="header-icon flex items-center justify-center gap-x-3 cursor-pointer group text-black"
                >
                    <ion-icon
                        name="menu-outline"
                        class="text-2xl group-hover:scale-105 duration-100"
                    ></ion-icon>
                    <p
                        class="group-hover:scale-105 duration-100 hidden md:block"
                    >
                        Menu
                    </p>
                </div>
            </nav>
        </header>
        <MobileMenu :isOpen="menuMobileOpen" @close="menuMobileOpen = false" />
    </div>
</template>
<style></style>
