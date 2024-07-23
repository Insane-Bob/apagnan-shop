<script setup lang="ts">
import { computed, defineProps, onMounted, reactive, ref } from 'vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import { Product, Collection } from '@types'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ApiClient } from '@/lib/apiClient'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'vue-router'
import { Textarea } from '@/components/ui/textarea'
import Button from '@/components/ui/button/Button.vue'
import SpecificTable from '@/components/views/admin/specifics/SpecificTable.vue'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import StockForm from '../stocks/StockForm.vue'
import Card from '@components/ui/card/Card.vue'
import CardDescription from '@components/ui/card/CardDescription.vue'
import Loader from '@components/ui/loader/Loader.vue'
import ImagePicker from '@components/Inputs/ImagePicker.vue'
import { useToast } from '@components/ui/toast'

const apiClient = new ApiClient()

const {toast} = useToast()
const router = useRouter()
const props = defineProps<{
    cslug: string
}>()

const errors = ref(null)
const slug = ref(props.cslug)
const product = reactive<{ product: Product }>({
    product: {
        name: '',
        price: 0,
        description: '',
        stock: 0,
        published: false,
        collectionId: 0,
    },
})

const collectionSlug = ref('')

const collections = reactive<Collection[]>([])

interface Image {
    id: number
    modelId: number
    modelName: string
    path: string
}

const fetchProductData = async () => {
    const response = await apiClient.get(
        'products/' + slug.value + '?withImages',
    )
    const data = await response.data
    product.product = data.product
}

const fetchCollections = async () => {
    const response = await apiClient.get('collections')
    const data = await response.data
    collections.push(...data.data)
}

function preParsePayload() {
    product.product.imagesIds = product.product.images.map(
        (image) => image.file.id,
    )
    product.product.price = Number(product.product.price)
}

const createProduct = async () => {
    try {
        preParsePayload()
        const response = await apiClient.post('products', product.product)
        toast({
            title: 'Produit créer',
            description: 'Le produit a bien été créer',
        })
        if (response.status === 201) {
            router.push('/admin/products/' + response.data.product.slug)
        }
    } catch (error: any) {
        if (error?.response?.status == 422) {
            errors.value = error.response.data.errors
            toast({
                title: 'Champs invalides',
                description: 'Certains champs sont invalides',
                variant: 'destructive',
            })
        } else
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue',
                variant: 'destructive',
            })
    }
}

const updateProduct = async () => {
    try {
        preParsePayload()
        const response = await apiClient.patch(
            'products/' + slug.value,
            product.product,
        )
        if (response.status === 200) {
            router.push('/admin/products/' + response.data.product.slug)
        }
        toast({
            title: 'Produit modifié',
            description: 'Le produit a bien été modifié',
        })
    } catch (error: any) {
        if (error?.response?.status == 422) {
            errors.value = error.response.data.errors
            toast({
                title: 'Champs invalides',
                description: 'Certains champs sont invalides',
                variant: 'destructive',
            })
        } else
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue',
                variant: 'destructive',
            })
    }
}

const onSubmit = () => {
    if (slug.value === 'new') {
        createProduct()
    } else {
        updateProduct()
    }
}

onMounted(async () => {
    await fetchCollections()
    if (slug.value !== 'new') {
        await fetchProductData()
        collectionSlug.value = collections.find((collection: Collection) => {
            return collection.id === product.product.collectionId
        })?.slug
    }
})

const loading = computed(() => {
    if (slug.value === 'new') {
        return {}
    } else {
        return product.product.id
    }
})

const images = computed({
    get: () => product.product?.images?.map((image) => image.file) || [],
    set: (value) => {
        product.product.images = value.map((file: object) => ({ file }))
    },
})
</script>

<template>
    <loader :wait-for="loading"></loader>
    <div class="max-w-4xl mx-auto p-6 flex flex-col gap-6">
        <Card class="p-6">
            <CardDescription class="mb-6">Fiche produit</CardDescription>

          <form @submit.prevent="onSubmit" class="grid grid-cols-4 gap-6">

              <FormInput :errors="errors" name="name" class="col-span-2">
                  <template #label>Nom</template>
                  <template #input="inputProps">
                      <input
                          type="text"
                          v-model="product.product.name"
                          v-bind="inputProps"
                      />
                  </template>
              </FormInput>
              <FormInput
                  :errors="errors"
                  name="collectionId"
                  class="col-span-2"
                  noBorder
              >
                <template #label>Collection</template>
                <template #input="inputProps">
                  <Select v-model="product.product.collectionId">
                    <SelectTrigger class="w-full">
                      <SelectValue placeholder="Select a collection" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Collections</SelectLabel>
                        <SelectItem
                            v-for="collection in collections"
                            :key="collection.id"
                            :value="collection.id"
                        >
                          {{ collection.name }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </template>
              </FormInput>
              <FormInput :errors="errors" name="price" class="col-span-2">
                  <template #label>Prix</template>
                  <template #input="inputProps">
                      <input
                          type="number"
                          min="0"
                          step="0.01"
                          v-model="product.product.price"
                          v-bind="inputProps"
                      />
                  </template>
              </FormInput>
              <FormInput class="col-span-2">
                  <template #label>Stock</template>
                  <template #input="inputProps">
                      <input
                          type="number"
                          v-model="product.product.stock"
                          v-bind="inputProps"
                          disabled
                      />
                  </template>
              </FormInput>

                <FormInput
                    :errors="errors"
                    name="description"
                    class="col-span-4"
                >
                    <template #label>Description</template>
                    <template #input="inputProps">
                        <textarea
                            class="min-h-[150px]"
                            v-model="product.product.description"
                            v-bind="inputProps"
                        ></textarea>
                    </template>
                </FormInput>

              <div class="flex items-center gap-x-4">
                  <Label
                      @click="
                          product.product.published = !product.product.published
                      "
                      for="published"
                      class="h-4 block text-xs text-zinc-800 font-medium first-letter:uppercase whitespace-nowrap"
                  >
                      Publié
                  </Label>
                  <Switch
                      name="published"
                      :checked="product.product.published"
                      @click="
                          product.product.published = !product.product.published
                      "
                      class=""
                  />
              </div>
              <div class="col-span-8">
                  <ImagePicker name="imagesId" :errors="errors" v-model="images"/>
                  <small class="text-slate-500">N'oubliez pas de sauvegarder le produit après avoir modifier les fichiers</small>
              </div>

              <div class="flex gap-4 col-span-4">
                  <Button type="submit">
                      {{ slug === 'new' ? 'Créer' : 'Modifier' }}
                  </Button>
                  <Dialog>
                      <DialogTrigger>
                          <Button type="button" variant="outlineDashboard">Gestion du stock</Button>
                      </DialogTrigger>
                      <DialogContent>
                          <StockForm
                              :productId="product.product.id"
                              @stockUpdated="fetchProductData"
                          ></StockForm>
                      </DialogContent>
                  </Dialog>
                  <RouterLink target="_blank" :to="'/collections/' + collectionSlug + '/products/' + slug">
                    <Button type="button" variant="outlineDashboard" class="flex items-center gap-x-1" >
                      <ion-icon name="open-outline"></ion-icon>
                      Voir la page produit
                    </Button>
                  </RouterLink>
                  <Button v-if="slug === 'new'"
                      variant="outlineDashboard"
                      @click="router.push('/admin/products')"
                  >Annuler
                  </Button>
              </div>
          </form>
        </Card>

        <SpecificTable
            v-if="product.product.id"
            :productId="product.product.id"
        ></SpecificTable>
    </div>
</template>
