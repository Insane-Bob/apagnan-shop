<script setup lang="ts">
import MyBreadcrumbComponent from '@/components/breadcrumb/MyBreadcrumbComponent.vue'
import ProductPictureCarousel from '@/components/product/ProductPictureCarousel.vue'
import ReviewDetailComponent from '@/components/product/ReviewDetailComponent.vue'
import ReviewNoteComponent from '@/components/product/ReviewNoteComponent.vue'
import SpecificsListComponent from '@/components/product/SpecificsListComponent.vue'
import StarComponent from '@/components/product/StarComponent.vue'
import Button from '@/components/ui/button/Button.vue'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card'
import Input from '@/components/ui/input/Input.vue'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/toast/use-toast'
import { ApiClient } from '@/lib/apiClient'
import { useCart } from '@/composables/useCart'
import { useSuggestion } from "@/composables/useSuggestion"
import Section from "@/layout/Section.vue"
import type { Collection, Product, Review } from '@/types'
import ProductCard2 from "@components/Cards/ProductCard2.vue"
import NotificationMenu from "@components/Menus/NotificationMenu.vue"
import SuggestionCarousel from "@components/product/SuggestionCarousel.vue"
import Loader from "@components/ui/loader/Loader.vue"
import { useUserStore } from '@store/user'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FormGrid from '../Forms/FormGrid.vue'

const apiClient = new ApiClient()

const user = useUserStore()
const router = useRouter()
const { toast } = useToast()

const route = useRoute()

const loading = ref(false)
const showMore = ref(false)

const product = ref<Product | null>(null)
const stock = ref(0)


const cart = useCart(product,stock)
const specifics = ref([])
const reviews = reactive<Review[]>([])
const collection = ref<Collection>({} as Collection)
const collectionImage = ref('')
const carouselImages = ref<string[]>([])
const breadcrumbLinks = computed(()=>[
  ['Accueil', '/'],
  ['Collections', '/collections/'+ collection.value?.slug],
  [collection.value?.name, '/collections/' + collection.value?.slug],
  [product.value?.name, "#"],
])

let stockSource : EventSource | null = null
function streamStock(){
  if(stockSource){
    stockSource.close()
  }

  stockSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/products/${product.value?.slug}/stock`)
  stockSource.onmessage = (event) => {
    stock.value = JSON.parse(event.data).stock
  }
  stockSource.onerror = (error) => {
    console.error('EventSource failed:', error)
    stockSource.close()
  }
}

const {items:suggestions,fetch:fetchSuggestions} = useSuggestion<Product>([route?.params?.pslug],5, 'products')
watch(() => route.params.pslug,fetchSuggestions)


const reviewForm = reactive<{ rate: number; content: string }>({
    rate: 0,
    content: '',
})

const fetchProduct = async () => {
    try {
        const response = await apiClient.get('products/' + route.params.pslug + "?withImages=tru")
        const data = response.data

        product.value = data.product

        if (data.product.images.length > 0) {
            carouselImages.value = data.product.images.map(
                (image) => image.url,
            )
        } else {
            carouselImages.value = ['/src/assets/images/noPhotoAvailable.webp']
        }
    } catch (e) {

        toast({
            title: "Le produit n'existe pas",
            variant: 'destructive',
        })
        router.push('/notFound')
    }
}

const fetchCollection = async () => {
    try {
        const response = await apiClient.get(
            'collections/' + route.params.cslug + "?withImage=true",
        )
        const data = response.data

        if (product.value?.collectionId !== data.collection.id) {
            toast({
                title: 'La collection ne correspond pas au produit',
                variant: 'destructive',
            })
            router.push('/notFound')
        }

        collection.value = data.collection
        if (data.collection.image) {
            collectionImage.value = data.collection.image
        } else {
            collectionImage.value = '/src/assets/images/noPhotoAvailable.webp'
        }
    } catch (e) {
        toast({
            title: "La collection n'existe pas",
            variant: 'destructive',
        })
        router.push('/notFound')
    }
}

const fetchProductReviews = async () => {
    const response = await apiClient.get(
        'products/' + route.params.pslug + '/reviews',
    )
    const data = await response.data

    data.reviews.forEach((review: Review) => {
        reviews.push(review)
    })
}

const fetchProductSpecifics = async () => {
    const response = await apiClient.get(
        'products/' + route.params.pslug + '/specifics',
    )
    const data = await response.data
    specifics.value = data.specifics
}

onMounted(async () => {
    await fetchProduct()
    await fetchCollection()
    await fetchProductReviews()
    await fetchProductSpecifics()

    loading.value = false
})

const sendReview = async () => {
    if (user.isAuthenticated && product.value) {
        const data = {
            ...reviewForm,
            rate: parseInt(reviewForm.rate.toString()),
            productId: product.value.id,
            userId: user.getId,
        }
        const response = await apiClient.post('/reviews', data)
        reviews.push(response.data.review)
        toast({
            title: 'Votre avis a été ajouté',
            description: 'Il sera visible après validation',
        })
        reviewForm.rate = 0
        reviewForm.content = ''
    }
}


watch(() => route.params.pslug, async () => {
    loading.value = true

    reviews.splice(0, reviews.length)
    specifics.value = []


    await fetchProduct()
    await fetchCollection()
    await fetchProductReviews()
    await fetchProductSpecifics()

    loading.value = false
})



watch(() => product.value, () => {
    if (product.value?.id) {
        streamStock()
    }
})




</script>

<template>
  <loader :wait-for="product">
    <div>
        <div class="h-80 flex items-center justify-center">
            <img
                :src="collectionImage.url"
                class="w-full h-full object-cover"
            />
        </div>
      <div class="w-full h-14 mb-10">
        <MyBreadcrumbComponent :links="breadcrumbLinks" />
      </div>
        <div v-if="!loading && product" class="flex justify-center">
            <div class="w-4/5 flex flex-col md:flex-row justify-center gap-16 mb-16">
                <ProductPictureCarousel :imageUrls="carouselImages" />
                <div class="w-full md:w-1/2 flex flex-col  gap-10">
                    <div class="flex justify-between">
                      <div>
                        <h1 class="text-3xl font-bold font-title">
                          {{ product?.name }}
                        </h1>
                        <ReviewNoteComponent
                        :note="
                            reviews.reduce(
                                (acc, review) => acc + review.rate,
                                0,
                            ) / reviews.length
                        "
                        :NbReviews="reviews.length"
                    />
                      </div>
                      <div>
                        <NotificationMenu :id="product.id" model-type="product" >
                         <div class="flex items-center">
                           <ion-icon name="notifications-outline" class="text-lg mr-3" />
                           Gestion des alertes
                         </div>
                        </NotificationMenu>
                      </div>
                    </div>
                    <div>
                        <p class="text-2xl font-semibold">
                            € {{ product.price }}
                        </p>
                        <p
                            class="text-sm"
                            :class="{
                                'text-red-400': !(stock > 0),
                                'text-orange-400': stock > 0,
                            }"
                            v-if="stock < 10"
                        >
                            {{
                                stock > 0
                                    ? 'Il reste ' +
                                      stock +
                                      ' article(s)'
                                    : "Il n'y a plus de stock, revenez plus tard"
                            }}
                        </p>
                        <p v-else class="text-green-700">
                          En stock
                        </p>
                    </div>
                    
                    <div class="flex flex-col md:flex-row gap-4">
                        <div class="flex items-center gap-x-2 max-w-72">
                            <p>Quantité</p>
                            <Input
                                type="number"
                                class="border-2 border-black rounded-sm max-w-24"
                                placeholder="Quantité"
                                v-model="cart.quantitySelected"
                            />
                        </div>
                        <Button
                            v-if="user.isAuthenticated"
                            :disabled="product.stock <= 0"
                            variant="outline"
                            @click="cart.addToCart()"
                            class="flex items-center gap-x-2"
                        >
                            Ajouter au panier
                            <ion-icon
                                name="cart-outline"
                                class="text-lg font-semibold"
                            ></ion-icon>
                        </Button>
                        <div v-else>
                            <Button
                                variant="outline"
                                disabled
                                class="flex items-center gap-x-2"
                            >
                                Connexion requise
                            </Button>
                        </div>
                    </div>
                    <div class="flex flex-col gap-3">
                        <h2 class="font-semibold text-xl">Détail du produit</h2>
                        <p class="text-slate-400" v-if="product.modele">
                            Modèle {{ product.modele }}
                        </p>
                        <p>{{ product.description }}</p>
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
        <div class="w-full flex justify-center my-4">
            <hr class="border-b border-primary/40 w-2/5" />
        </div>

        <div v-if="reviews" class="flex flex-col items-center justify-center mb-7">
            <div class="w-3/5 flex flex-col items-center">
                <h2 class="text-2xl font-semibold uppercase mb-4">
                    Avis des clients
                </h2>
                <div class="flex flex-col gap-4 text-left">
                    <ReviewDetailComponent
                            :reviews="reviews"
                        />
                    <div
                        v-for="review in reviews
                            .sort((r1, r2) => r2.rate - r1.rate)
                            .slice(0, 7)"
                        :key="review.id"
                        class="flex flex-col gap-2 mt-4"
                    >
                    <Card>
                        <CardHeader>
                        <CardTitle>
                            <div class="text-lg font-medium mb-0 flex justify-start items-center gap-x-2">
                                <StarComponent :value="review.rate" />
                                <span> - {{  review.User.firstName + ' ' +  review.User.lastName}}</span>
                            </div>
                        </CardTitle>
                        <CardDescription>
                            {{
                                new Date(
                                    review.createdAt,
                                ).toLocaleDateString()
                            }}
                        </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {{ review.content }}
                        </CardContent>
                    </Card>
                    </div>
                </div>
            </div>       

            <div
                class="w-2/5 flex flex-col items-center mt-4"
                v-if="user.isAuthenticated"
            >
                <div class="w-full flex flex-col gap-4">
                    <h2 class="text-lg tracking-wider uppercase">
                        Laisser un avis
                    </h2>
                    <form @submit.prevent="sendReview()">
                        <FormGrid>
                            <Select v-model="reviewForm.rate">
                                <SelectTrigger class="col-span-full">
                                    <SelectValue
                                        placeholder="Choisir une note"
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem
                                            v-for="value in 5"
                                            :value="value.toString()"
                                            :key="value"
                                            
                                        >
                                            <div class="flex justify-start items-center gap-x-3"><span>{{ value }}. </span><StarComponent :value="value" /></div>
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <textarea
                                v-model="reviewForm.content"
                                rows="3"
                                class="col-span-full border border-[hsl(0 0% 89.8%)] p-2"
                            ></textarea>
                            <Button
                                class="uppercase tracking-wider col-start-7 col-span-6"
                                >Envoyer</Button
                            >
                        </FormGrid>
                    </form>
                </div>
            </div>
        </div>
    </div>
  </loader>
  <Section class="bg-slate-100">
    <h1 class="text-md uppercase font-medium text-center">
      Vous aimerez aussi
    </h1>
    <div
        class="justify-items-center max-w-[1000px] mx-auto"
    >
      <SuggestionCarousel :suggestions="suggestions.map((p : Product)=>({...p,url:`/collections/${p?.Collection?.slug}/products/${p.slug}`}))" >
        <template #item="{suggestion}">
          <ProductCard2

              height="300px"
              :key="suggestion.id"
              :name="suggestion.name"
              :slug="suggestion.slug"
              :collection="suggestion?.Collection"
              :shortDescription="suggestion.description" :image="suggestion?.mainImage">
            <template #action>
              <Button class="hover:text-primary transition uppercase" variant="ghost">
                Decouvrir ce nain
                <ion-icon name="chevron-forward-outline" class="text-lg ml-4"/>
              </Button>
            </template>
          </ProductCard2>
        </template>
      </SuggestionCarousel>
    </div>
  </Section>

</template>
