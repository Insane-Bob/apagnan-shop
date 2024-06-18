<script setup lang="ts">
import MyBreadcrumbComponent from '@/components/breadcrumb/MyBreadcrumbComponent.vue'
import ProductPictureCarousel from '@/components/product/ProductPictureCarousel.vue'
import ReviewNoteComponent from '@/components/product/ReviewNoteComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import SpecificsListComponent from '@/components/product/SpecificsListComponent.vue'
import FeaturedProductsCarousel from '@/components/product/FeaturedProductsCarousel.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const route = useRoute()
const collectionSlug = route.params.cslug
const productSlug = route.params.pslug
console.log(productSlug)
const ProductUrl =
    API_BASE_URL + '/collections/' + collectionSlug + '/products/' + productSlug
const CollectionUrl = API_BASE_URL + '/collections/' + collectionSlug

const product = ref({})
const specifics = ref([])
const reviews = ref({ note: 0, nbReviews: 0 })
const collection = ref({})
const collectionImage = ref('')
const carouselImages = ref<string[]>([])
const breadcrumbLinks = ref([
    ['Accueil', '/'],
    ['Collections', '/collections'],
    ['', '#'],
    ['', '#'],
])

const fetchProduct = async () => {
    const response = await fetch(ProductUrl)
    const data = await response.json()
    product.value = data.product
    breadcrumbLinks.value[3] = [
        data.product.name,
        '/collections/' + collectionSlug + '/products/' + productSlug,
    ]
    carouselImages.value = data.images.map((image) => '/src/' + image.path)
}

const fetchCollection = async () => {
    const response = await fetch(CollectionUrl)
    const data = await response.json()
    collection.value = data.collection
    collectionImage.value = data.image.path
    breadcrumbLinks.value[2] = [
        data.collection.name,
        '/collections/' + collectionSlug,
    ]
}

const fetchProductReviews = async () => {
    const response = await fetch(ProductUrl + '/reviews')
    const data = await response.json()
    const reviewData = data.reviews
    const nbReviews = reviewData.length
    const totalNote = reviewData.reduce((sum, review) => sum + review.rate, 0)
    const note = nbReviews ? totalNote / nbReviews : 0

    reviews.value = { note, nbReviews }
}

const fetchProductSpecifics = async () => {
    const response = await fetch(ProductUrl + '/specifics')
    const data = await response.json()
    specifics.value = data.specifics
}

onMounted(() => {
    fetchProduct()
    fetchCollection()
    fetchProductReviews()
    fetchProductSpecifics()
})
</script>

<template>
    <div>
        <div class="h-80 flex items-center justify-center">
            <img
                :src="'/src/' + collectionImage"
                class="w-full h-full object-cover"
            />
        </div>
        <div class="w-full h-14 mb-10">
            <MyBreadcrumbComponent :links="breadcrumbLinks" />
        </div>
        <div class="flex justify-center">
            <div class="w-4/5 flex justify-center gap-16 mb-16">
                <ProductPictureCarousel :imageUrls="carouselImages" />
                <div class="w-1/2 flex flex-col gap-10">
                    <h1 class="text-3xl font-bold font-title">
                        {{ product.name }}
                    </h1>
                    <ReviewNoteComponent
                        :note="reviews.note"
                        :NbReviews="reviews.nbReviews"
                    />
                    <p class="text-2xl font-semibold">€ {{ product.price }}</p>
                    <div class="flex flex-col gap-3">
                        <h2 class="font-semibold text-xl">Détail du produit</h2>
                        <p class="text-slate-400">
                            Modèle {{ product.modele }}
                        </p>
                        <p>{{ product.description }}</p>
                    </div>
                    <div class="flex gap-4">
                        <Button>Acheter maintenant</Button>
                        <Button variant="outline">Ajouter au panier</Button>
                    </div>
                    <div class="text-slate-400 flex items-center gap-2">
                        En savoir plus
                        <ion-icon name="arrow-down-outline"></ion-icon>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-center mb-24">
            <div class="w-4/5 flex gap-16 flex-col items-center">
                <h2 class="text-2xl font-semibold">Caractéristiques</h2>
                <SpecificsListComponent :specifics="specifics" />
            </div>
        </div>
        <div class="flex justify-center mb-7">
            <div class="w-4/5 flex gap-16 flex-col items-center">
                <h2 class="text-2xl font-semibold uppercase">
                    Vous aimerez aussi
                </h2>
                <FeaturedProductsCarousel />
            </div>
        </div>
    </div>
</template>
