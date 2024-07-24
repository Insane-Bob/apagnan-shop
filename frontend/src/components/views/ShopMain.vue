<template>
    <div
        v-on:scroll="scrollFunction"
        class="flex flex-col h-full overflow-x-hidden"
    >
        <div
            class="h-screen flex flex-col justify-between items-center pt-[10%] pb-20 overflow-x-hidden"
        >
            <img
                v-if="collection.image"
                :src="collection.image.url"
                alt="Main Gnome"
                class="main-shop-page object-cover absolute top-0 h-screen w-full brightness-50 -z-10"
            />

            <div
                v-else
                class="absolute top-0 h-screen w-full bg-primary-accent/90 -z-10"
            ></div>

            <PromoBanner class="fixed top-0" @isPromo="promoPromoted = true" />
            <HeaderComponent
                :class="{ 'ag-header--with-promo': promoPromoted }"
                :variant="isOnTop ? 'home' : 'home-white'"
            />
            <h1
                class="main-title uppercase mt-16 md:mt-12 lg:mt-8 text-white font-bold text-4xl md:text-[130px] lg:text-[150px] opacity-75"
            >
                Apagnain
            </h1>

            <div class="flex flex-col justify-center items-center gap-y-3">
                <p
                    class="text-white text-lg md:text-[20px] uppercase tracking-wider"
                >
                    {{ collection.name }}
                </p>
                <RouterLink to="#promoted">
                    <Button
                        class="uppercase font-bold text-white rounded-lg px-6 py-3 transition-all duration-300 ease-in-out hover:bg-white hover:text-gray-900 hover:border-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 shadow-md hover:shadow-lg active:scale-95"
                    >
                        Découvrir la collection
                    </Button>
                </RouterLink>
            </div>
        </div>
        <Section class="max-w-[1200px] mx-auto">
            <h1 class="text-md uppercase font-medium text-center">
                Collection à la une
            </h1>
            <div
                v-if="!loading"
                id="promoted"
                class="justify-items-center grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-20"
            >
            
                <ProductCard
                    :key="product.id"
                    :id="product.id"
                    v-for="product in collection.Products"
                    :collection="collection"
                    :name="product.name"
                    :slug="product.slug"
                    :shortDescription="product.description"
                    :price="product.priceFormatted"
                    :image="product.mainImage"
                    height="300px"
                />
            </div>
            <div
                v-else
                id="shop"
                class="w-screen bg-white justify-items-center grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-20"
            >
                <ProductCardSkeleton v-for="index in 6" v-bind:key="index" />
            </div>
        </Section>

        <Section v-if="collections.length" class="bg-slate-100">
            <h1 class="text-md uppercase font-medium text-center">
                Nos collections
            </h1>
            <div
                id="collections"
                class="justify-items-center max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
            >
                <ProductCard
                    height="300px"
                    v-for="collection in collections.slice(0, 6)"
                    :id="collection.id"
                    :key="collection.id"
                    :name="collection.name"
                    :slug="collection.slug"
                    :shortDescription="collection.description"
                    :image="collection?.image"
                >
                    <template #action>
                        <Button class="hover:text-primary transition uppercase">
                            Découvrir la collection
                            <ion-icon
                                name="chevron-forward-outline"
                                class="text-lg ml-4"
                            />
                        </Button>
                    </template>
                </ProductCard>
            </div>
        </Section>
        <Section class="max-w-[1000px] mx-auto">
            <h1 class="text-md uppercase font-medium text-center">
                Notre newsletter
            </h1>
            <Newsletter />
        </Section>
    </div>
    <FooterComponent />
</template>

<script setup lang="ts">
import PromoBanner from '@components/promo/PromoBanner.vue'
import { ApiClient } from '@/lib/apiClient'
import type { Collection } from '@/types'
import ProductCard from '@components/Cards/ProductCard2.vue'
import ProductCardSkeleton from '@components/Cards/ProductCardSkeleton.vue'
import FooterComponent from '@components/footer/FooterComponent.vue'
import Button from '@components/ui/button/Button.vue'
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import HeaderComponent from '@components/Header/HeaderComponent.vue'
import Section from '@/layout/Section.vue'
import Newsletter from '@components/Newsletter/Newsletter.vue'
import { useToast } from '@components/ui/toast'

const apiClient = new ApiClient()

const { toast } = useToast()
const router = useRouter()

const promoPromoted = ref(false)

const loading = ref(true)
const collection = ref<Collection>({} as Collection)
const isOnTop = ref(true)

function changeBrightness() {
    const mainShopPage = document.querySelector('.main-shop-page')
    const mainTitle = document.querySelector('.main-title')
    const mainHeader = document.querySelector('.main-header')
    const HeaderIcons = document.querySelectorAll('.header-icon')
    const headerTitle = document.querySelector('.header-title')

    if (mainShopPage) {
        if (isOnTop.value) {
            mainShopPage.classList.add('brightness-50')
        } else {
            mainShopPage.classList.remove('brightness-50')
        }
    }

    if (mainTitle) {
        if (isOnTop.value) {
            mainTitle.classList.add('opacity-75')
            mainTitle.classList.remove('opacity-0')
        } else {
            mainTitle.classList.remove('opacity-75')
            mainTitle.classList.add('opacity-0')
        }
    }

    if (mainHeader) {
        mainHeader.classList.toggle('bg-white')
        mainHeader.classList.toggle('bg-transparent')
    }

    if (HeaderIcons) {
        HeaderIcons.forEach((icon) => {
            if (isOnTop.value) {
                icon.classList.add('text-white')
                icon.classList.remove('text-black')
                return
            } else {
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
    if (router.currentRoute.value.query.activate === 'true') {
        toast({
            title: 'Succès',
            description: 'Votre compte a été activé avec succès',
            duration: 2000,
        })
    }

    await fetchPromotedCollection()
    await fetchCollections()
    loading.value = false
})

const collections = ref<Collection[]>([])
async function fetchCollections() {
    const response = await apiClient.get('collections?withImage&limit=6&random')
    collections.value = response.data.data
    console.log(collections.value)
}

const fetchPromotedCollection = async () => {
    try {
        const response = await apiClient.get('collections/promoted')

        collection.value = response.data.collection
    } catch (e) {
        toast({
            title: 'Une Erreur est survenue',
            variant: 'destructive',
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

body {
    overflow-x: hidden;
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
