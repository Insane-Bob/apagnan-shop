<template>
    <MobileMenu :isOpen="menuMobileOpen" @close="menuMobileOpen = false" />
    <div v-on:scroll="scrollFunction" class="flex flex-col h-full">
        <div 
            class="h-screen flex flex-col justify-between items-center pt-[10%] pb-20"
        >
            <img v-if="collection.image"
                :src="'/src/'+ collection.image.path "
                alt="Main Gnome"
                class="main-shop-page object-cover absolute top-0 h-screen w-screen brightness-50 -z-10"
            />

            <div v-else class="absolute top-0 h-screen w-screen bg-primary-accent/90 -z-10"></div>

            <header
                class="main-header fixed top-0 h-24 bg-transparant w-full z-20 flex justify-end items-center px-4 md:px-20"
            >
                <RouterLink to="/">
                    <div
                        class="header-title tracking-widest uppercase text-black font-bold text-xl md:text-4xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-0"
                    >
                        <img
                            class="flex items-center relative right-1/2 translate-x-40 h-full pt-4"
                            src="/src/assets/logo_black.svg"
                            alt="Apagnain Logo"
                        />
                    </div>
                </RouterLink>
                <nav class="flex justy-center items-center gap-x-6">
                    <Sheet v-if="!isLogged">
                        <SheetTrigger as-child>
                            <ion-icon
                                name="log-in-outline"
                                class="header-icon text-white text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"
                            ></ion-icon>
                        </SheetTrigger>
                        <SheetContent>
                            <AuthDrawer />
                        </SheetContent>
                    </Sheet>

                    <Sheet v-if="isLogged">
                        <SheetTrigger>
                            <div class="relative group">
                                <ion-icon 
                                    name="cart-outline"
                                    class="header-icon text-white text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"
                                ></ion-icon>
                                <div v-if="user.countCartItem > 0"  class="group-hover:scale-105 absolute -top-2 -right-2 bg-red-500 rounded-full text-xs text-white w-4 h-4">
                                    <div :class="{'animate-ping': user.cartHasNewItems, 'bg-red-500/20 rounded-full w-4 h-4 absolute': true}"></div>
                                    <span class="text-white">{{ user.countCartItem }}</span>
                                </div>
                            </div>
                        </SheetTrigger>
                        <SheetContent><CartDrawer /></SheetContent>
                    </Sheet>

                    <RouterLink to="/profile" v-if="isLogged">
                        <ion-icon
                            name="person-outline"
                            class="header-icon text-white text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"
                        ></ion-icon>
                    </RouterLink>

                    <RouterLink to="/logout" v-if="isLogged">
                        <ion-icon
                            name="log-out-outline"
                            class="header-icon text-white text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"
                        ></ion-icon>
                    </RouterLink>

                    <RouterLink to="/admin" v-if="isLogged && user.isAdmin">
                        <ion-icon
                            name="laptop-outline"
                            class="header-icon text-white text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"
                        ></ion-icon>
                    </RouterLink>

                    <form
                        @submit.prevent="onSearch()"
                        class="flex justify-center items-center -ml-6 gap-x-2"
                    >
                        <input
                            v-model="search.query"
                            name="search"
                            type="text"
                            class="rounded-sm duration-500 px-2 py-1 max-w-44 text-current"
                            :class="{
                                'w-0 border-0 bg-transparent': !search.show,
                                'w-[30vw] border ml-2': search.show,
                            }"
                            placeholder="Search..."
                        />
                        <button class="flex justify-center items-center">
                            <ion-icon
                                name="search-outline"
                                class="header-icon text-white text-2xl cursor-pointer hover:scale-105 duration-100"
                            ></ion-icon>
                        </button>
                    </form>
                    <div
                        @click="onOpenBurgerMenu()"
                        class="md:hidden header-icon flex items-center justify-center gap-x-3 cursor-pointer group text-white"
                    >
                        <ion-icon
                            name="menu-outline"
                            class="text-2xl group-hover:scale-105 duration-100"
                        ></ion-icon>
                        <p
                            class="group-hover:scale-105 hidden md:block duration-100"
                        >
                            Menu
                        </p>
                    </div>
                </nav>
            </header>
            <h1
                class="main-title uppercase mt-12 md:mt-5 lg:mt-0  text-white font-bold text-4xl md:text-[130px] lg:text-[150px] opacity-75"
            >
                Apagnain
            </h1>

            <!-- @TODO: Find a way to close the modal -->
            <CookiesModal :open="showCookiesModal" />

            <div class="flex flex-col justify-center items-center gap-y-3">
                <p class="text-white text-lg md:text-[20px] uppercase tracking-wider">
                    {{ collection.name }}
                </p>
                <RouterLink to="#promoted">
                    <Button variant="secondary" class="uppercase" 
                        >Découvrir la collection</Button
                    >
                </RouterLink>
            </div>
        </div>

        <div
            v-if="!loading"
            id="promoted"
            class="w-screen h-screen bg-white py-14 px-24 justify-items-center grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-20"
        >
            <ProductCard2 :key="product.id" v-for="product in collection.Products" :collection="collection" :name="product.name" :slug="product.slug" :shortDescription="product.description.slice(0,25)" :price="product.price" :image="product.images[0]" />
        </div>

        <div
            v-if="loading"
            id="shop"
            class="w-screen h-screen bg-white py-14 px-24 justify-items-center grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-20"
        >
            <ProductCardSkeleton v-for="index in 6" v-bind:key="index" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { apiClient } from '@/lib/apiClient'
import type { Collection } from '@/types'
import ProductCard2 from '@components/Cards/ProductCard2.vue'
import ProductCardSkeleton from '@components/Cards/ProductCardSkeleton.vue'
import CartDrawer from '@components/Drawers/CartDrawer.vue'
import MobileMenu from '@components/mobile/MobileMenu.vue'
import CookiesModal from '@components/Modals/CookiesModal.vue'
import Button from '@components/ui/button/Button.vue'
import { useUserStore } from '@store/user'
import {
    computed,
    onMounted,
    onUnmounted,
    reactive,
    ref
} from 'vue'
import { RouterLink } from 'vue-router'
import AuthDrawer from '../Drawers/AuthDrawer.vue'
import { useToast } from '@components/ui/toast'



const user = useUserStore()
const { toast } = useToast()
const isLogged = computed(() => user.isAuthenticated)

const loading = ref(true)

const search = reactive({
    query: '',
    show: false,
})

const collection = ref<Collection>({} as Collection)

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

const isOnTop = ref(true)
const showCookiesModal = ref(true)

function changeBrightness() {
    const mainShopPage = document.querySelector('.main-shop-page')
    const mainTitle = document.querySelector('.main-title')
    const mainHeader = document.querySelector('.main-header')
    const HeaderIcons = document.querySelectorAll('.header-icon')
    const headerTitle = document.querySelector('.header-title')

    if (mainShopPage) {
        if(isOnTop.value){
            mainShopPage.classList.add('brightness-50')
        }else{
            mainShopPage.classList.remove('brightness-50')
        }
    }

    if (mainTitle) {
        if(isOnTop.value){
            mainTitle.classList.add('opacity-75')
            mainTitle.classList.remove('opacity-0')

        }else{
            mainTitle.classList.remove('opacity-75')
            mainTitle.classList.add('opacity-0')
        }
    }

    if (mainHeader) {
        mainHeader.classList.toggle('bg-white')
        mainHeader.classList.toggle('bg-transparant')
    }

    if (HeaderIcons) {
        HeaderIcons.forEach((icon) => {
            if(isOnTop.value){
                icon.classList.add('text-white')
                icon.classList.remove('text-black')
                return
            }else{
                icon.classList.remove('text-white')
                icon.classList.add('text-black')
            }
            
        })
    }

    if (headerTitle) {
        headerTitle.classList.toggle('opacity-0')
    }
}

const scrollFunction = () => {
    if (document.body.getBoundingClientRect().top < 0) {
        if (isOnTop.value) {
            isOnTop.value = false
            changeBrightness()
        }
    } else {
        if (!isOnTop.value) {
            isOnTop.value = true
            changeBrightness()
        }
    }
}

window.addEventListener('scroll', scrollFunction)

onUnmounted(() => {
    window.removeEventListener('scroll', scrollFunction)
})

onMounted(async () => {
    await fetchPromotedCollection()
    loading.value = false

    setTimeout(() => {
        showCookiesModal.value = false
    }, 500)
})


const fetchPromotedCollection = async () => {
    try{
    const response = await  apiClient.get('collections/promoted')

    collection.value = response.data.collection
    }catch(e){
        toast({
            title: 'Une Erreur est survenue',
            variant: 'destructive'
        })
    }

}
</script>

<style scoped>
.main-shop-page {
    transition: all 1s;
}

.main-title {
    transition: all 1s;
    letter-spacing: 0.1em;
    animation: forwards 1s ease-in-out 0s 1 spaceLetters;
}

.main-header {
    transition: all 1s;
}

.header-icon {
    transition: all 1s;
}

.header-title {
    transition: all 1s;
}

@keyframes spaceLetters {
    0% {
        letter-spacing: 0em;
    }

    100% {
        letter-spacing: 0.2em;
    }
}
</style>
