<script setup lang="ts">
import MyBreadcrumbComponent from '@/components/breadcrumb/MyBreadcrumbComponent.vue'
import ProductPictureCarousel from '@/components/product/ProductPictureCarousel.vue'
import ReviewNoteComponent from '@/components/product/ReviewNoteComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import SpecificsListComponent from '@/components/product/SpecificsListComponent.vue'
import FeaturedProductsCarousel from '@/components/product/FeaturedProductsCarousel.vue'
import { ref, onMounted, reactive } from 'vue'
import { apiClient } from '@/lib/apiClient'
import { useRoute } from 'vue-router'
import { useUserStore } from '@store/user'
import { useToast } from '@/components/ui/toast/use-toast'
import type { Product, Review } from '@/types'
import { useRouter } from 'vue-router'



const user = useUserStore()
const router = useRouter()
const { toast } = useToast()

const route = useRoute()

const loading = ref(false)
const showMore = ref(false)


const quantitySelected = ref(1)
const product = ref<Product | null>(null)
const otherProducts= ref<Product[]>([])
const specifics = ref([])
const reviews = reactive<Review[]>([])
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
    try{
    const response = await apiClient.get('products/' + route.params.pslug)
    const data = response.data


    product.value = data.product
    breadcrumbLinks.value[3] = [
        data.product.name,
        '/collections/' + route.params.cslug + '/products/' + route.params.pslug,
    ]
    if(data.images.length > 0){
    carouselImages.value = data.images.map((image: {path: string}) => '/src/' + image.path)
    }else{
        carouselImages.value = ['/src/assets/images/noPhotoAvailable.webp']
    }
    }catch(e){
        toast({
            title: 'Le produit n\'existe pas',
            variant: 'destructive',
        })
        router.push('/notFound')
    }
}

const fetchCollection = async () => {
    try{
    const response = await apiClient.get('collections/' + route.params.cslug)
    const data = response.data

    if(product.value?.collectionId !== data.collection.id){
        toast({
            title: 'La collection ne correspond pas au produit',
            variant: 'destructive',
        })
        router.push('/notFound')
    }

    collection.value = data.collection
    collectionImage.value = data.image.path
    breadcrumbLinks.value[2] = [
        data.collection.name,
        '/collections/' + route.params.collectionSlug,
    ]

    }catch(e){
        toast({
            title: 'La collection n\'existe pas',
            variant: 'destructive',
        })
        router.push('/notFound')
    }
}

const fetchCollectionProducts =  async () =>{
    const response = await apiClient.get('collections/' + route.params.cslug + '/products')
    const data = response.data

    const images = data.images

    otherProducts.value = data.products

    otherProducts.value.forEach((product: Product) => {
        product.images = images.filter((image: {modelId: number, modelName: string}) => image.modelId === product.id && image.modelName == 'product')
    })

    otherProducts.value = otherProducts.value.filter((p: Product) => p.id !== product.value?.id)

    otherProducts.value = otherProducts.value.slice(0, 5)
}

const fetchProductReviews = async () => {
    const response = await apiClient.get('products/' + route.params.pslug + '/reviews')
    const data = await response.data
    
    data.reviews.forEach((review: Review) => {
        reviews.push(review)
    })
}

const fetchProductSpecifics = async () => {
    const response = await apiClient.get('products/' + route.params.pslug + '/specifics')
    const data = await response.data
    specifics.value = data.specifics
}

const addToCart = async () => {
    if (user.isAuthenticated && product.value) {
        const reponse = await  apiClient.put('users/' + user.getId + '/basket/' + product.value.id, {quantity: quantitySelected.value} )
        user.addItem(reponse.data.items)
        toast({
            title: 'Le produit a été ajouté à votre panier',
        })
    }
}

onMounted(async () => {
    await fetchProduct()
    await fetchCollection()
    await fetchProductReviews()
    await fetchProductSpecifics()
    await fetchCollectionProducts()

    loading.value = false

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
        <div v-if="!loading && product" class="flex justify-center">
            <div class="w-4/5 flex justify-center gap-16 mb-16">
                <ProductPictureCarousel :imageUrls="carouselImages" />
                <div class="w-1/2 flex flex-col gap-10">
                    <h1 class="text-3xl font-bold font-title">
                        {{ product?.name }}
                    </h1>
                    <ReviewNoteComponent
                        :note="reviews.reduce((acc, review) => acc + review.rate, 0) / reviews.length"
                        :NbReviews="reviews.length"
                    />
                    <div>
                        <p class="text-2xl font-semibold">€ {{ product.price }}</p>
                        <p class="text-sm" :class="{'text-red-400':!(product.stock>0), 'text-orange-400':(product.stock>0)}" v-if="product.stock < 10">{{ product.stock>0?'Il reste '+ product.stock + ' article(s)': 'Il n\'y a plus de stock, revenez plus tard'}}</p>
                    </div>
                    <div class="flex flex-col gap-3">
                        <h2 class="font-semibold text-xl">Détail du produit</h2>
                        <p class="text-slate-400" v-if="product.modele">
                            Modèle {{ product.modele }}
                        </p>
                        <p>{{ product.description }}</p>
                    </div>
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex items-center gap-x-2 max-w-72">
                            <p>Quantité</p>
                            <Input type="number" class="border-2 border-black rounded-sm max-w-24" placeholder="Quantité" v-model="quantitySelected" />
                        </div>
                        <Button v-if="user.isAuthenticated" variant="outline" @click="addToCart()" class="flex items-center gap-x-2">
                            Ajouter au panier
                            <ion-icon name="cart-outline" class="text-lg font-semibold"></ion-icon>
                        </Button>
                        <div v-else>
                            <Button  variant="outline" disabled class="flex items-center gap-x-2">
                                Connexion requise
                            </Button>
                        </div>
                    </div>
                    <div @click="showMore = !showMore" class="text-slate-400 flex items-center gap-2 cursor-pointer">
                        {{showMore?'Voir moins':'En savoir plus'}}
                        <ion-icon v-show="!showMore" name="arrow-down-outline"></ion-icon>
                        <ion-icon v-show="showMore" name="arrow-up-outline"></ion-icon>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showMore" class="flex justify-center mb-24">
            <div class="w-4/5 flex gap-16 flex-col items-center">
                <h2 class="text-2xl font-semibold">Caractéristiques</h2>
                <SpecificsListComponent :specifics="specifics" />
            </div>
        </div>
        <div v-if="otherProducts.length>0" class="flex justify-center mb-7">
            <div class="w-4/5 flex gap-16 flex-col items-center">
                <h2 class="text-2xl font-semibold uppercase">
                    Vous aimerez aussi
                </h2>
                <FeaturedProductsCarousel :products= otherProducts />
            </div>
        </div>

        <div v-if="reviews" class="flex justify-center mb-7">
            <div class="w-4/5 flex flex-col items-center">
                <h2 class="text-2xl font-semibold uppercase">
                    Avis des clients
                </h2>
                <div class="flex flex-col gap-4">
                    <ReviewNoteComponent
                        :note="reviews.reduce((acc, review) => acc + review.rate, 0) / reviews.length"
                        :NbReviews="reviews.length"
                    />
                    <div class="flex flex-col gap-4">
                        <div v-for="review in reviews" :key="review.id" class="flex flex-col gap-2">
                            <div>
                                <p class="text-lg font-semibold mb-0">{{ review.rate }}/5</p>
                                <p class="text-sm font-light">{{ new Date(review.createdAt).toLocaleDateString() }}</p>
                            </div>
                            <p>{{ review.content }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
