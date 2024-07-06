<script setup lang="ts">
import { onUnmounted, reactive, ref } from 'vue'
import MobileMenu from '@components/mobile/MobileMenu.vue'

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
    <header
        class="main-header fixed top-0 h-24 bg-white w-full z-40 flex justify-end items-center px-4 md:px-20"
    >
        <RouterLink to="/">
            <img
                class="flex items-center relative right-1/2 -translate-x-40 h-full pt-4"
                src="/src/assets/logo_black.svg"
                alt="Apagnain Logo"
            />
        </RouterLink>
        <nav class="flex justy-center gap-x-6 items-center">
            <ion-icon
                name="cart-outline"
                class="header-icon text-black text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"
            ></ion-icon>
            <RouterLink to="/profile">
                <ion-icon
                    name="person-outline"
                    class="header-icon text-black text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"
                ></ion-icon>
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
                <p class="group-hover:scale-105 duration-100 hidden md:block">
                    Menu
                </p>
            </div>
        </nav>
    </header>
    <MobileMenu :isOpen="menuMobileOpen" @close="menuMobileOpen = false" />
</template>
