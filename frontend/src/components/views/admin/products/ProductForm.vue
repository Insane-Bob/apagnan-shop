<script setup lang="ts">
import { defineProps, onMounted, reactive, ref } from 'vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import DataTable from '@/components/tables/DataTable.vue'
import SpecificFormItem from '@/components/views/admin/specifics/SpecificForm.vue'
import { Product, Collection, Specific, Page } from '@types'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { apiClient } from '@/lib/apiClient'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'vue-router'
import { Textarea } from '@/components/ui/textarea'
import Button from '@/components/ui/button/Button.vue'
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

const router = useRouter()
const props = defineProps<{
    cslug: string
}>()

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

const collections = reactive<Collection[]>([])

const specifics = reactive<Specific[]>([])
const SpecificForm = reactive<{ specific: Specific | null }>({
    specific: null,
})

const page = reactive<Page>({
    current: 1,
    total: specifics.length,
    perPage: 10,
})

const columns = [
    {
        label: 'Nom',
        key: 'name',
        sorting: true,
    },
    {
        label: 'Contenu',
        key: 'content',
        sorting: true,
    },
]

const actions = [
    {
        label: 'Modifier',
        icon: 'pencil-outline',
        class: 'text-blue-500',
        trigger: true,
        action: (specific: Specific) => {
            SpecificForm.specific = specific
        },
    },
    {
        label: 'Supprimer',
        icon: 'trash-outline',
        class: 'text-red-500',
        action: (specific: Specific) => {
            console.log('delete', specific)
        },
    },
]

function onNextPage() {
    page.current++
}

function onPreviousPage() {
    page.current--
}

interface Image {
    id: number
    modelId: number
    modelName: string
    path: string
}
const images = ref<Image[]>([])

const fetchProductData = async () => {
    const response = await apiClient.get('products/' + slug.value)
    const data = await response.data
    product.product = data.product
    images.value.push(...data.images)
    console.log('product selected', data)
}

const fetchCollections = async () => {
    const response = await apiClient.get('collections')
    const data = await response.data
    collections.push(...data.collections)
}

const createProduct = async () => {
    const response = await apiClient.post('products', product.product)
    if (response.status === 201) {
        router.push('/admin/products/' + response.data.product.slug)
    }
}

const updateProduct = async () => {
    const response = await apiClient.patch(
        'products/' + slug.value,
        product.product,
    )
    if (response.status === 200) {
        router.push('/admin/products/' + response.data.product.slug)
    }
}

const onSubmit = () => {
    if (slug.value === 'new') {
        createProduct()
    } else {
        updateProduct()
    }
}

onMounted(() => {
    if (slug.value !== 'new') {
        fetchProductData()
    }
    fetchCollections()
    fetchSpecifics()
})

const fetchSpecifics = async () => {
    const response = await apiClient.get(
        'products/' + slug.value + '/specifics',
    )
    const data = await response.data
    specifics.push(...data.specifics)
    page.total = specifics.length
}
</script>

<template>
    <form @submit.prevent="onSubmit">
        <FormInput>
            <template #label>Nom</template>
            <template #input="inputProps">
                <input
                    type="text"
                    v-model="product.product.name"
                    v-bind="inputProps"
                />
            </template>
        </FormInput>
        <FormInput>
            <template #label>Prix</template>
            <template #input="inputProps">
                <input
                    type="number"
                    v-model="product.product.price"
                    v-bind="inputProps"
                />
            </template>
        </FormInput>
        <FormInput>
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
        <FormInput>
            <template #label>Description</template>
            <template #input="inputProps">
                <textarea
                    v-model="product.product.description"
                    v-bind="inputProps"
                ></textarea>
            </template>
        </FormInput>
        <FormInput>
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
        <div
            class="row-span-1 col-start-1 col-span-full flex items-center gap-x-4"
        >
            <Label
                @click="product.product.published = !product.product.published"
                for="published"
                class="h-4 block text-xs text-zinc-800 font-medium first-letter:uppercase whitespace-nowrap"
            >
                Publié
            </Label>
            <Switch
                name="published"
                :checked="product.product.published"
                @click="product.product.published = !product.product.published"
                class=""
            />
        </div>
        <div class="mt-4 flex gap-2">
            <Button type="submit">
                {{ slug === 'new' ? 'Créer' : 'Modifier' }}
            </Button>
            <Dialog>
                <DialogTrigger>
                    <Button type="button">Gestion du stock</Button>
                </DialogTrigger>
                <DialogContent>
                    <StockForm :productId="product.product.id"></StockForm>
                </DialogContent>
            </Dialog>
        </div>
    </form>

    <div class="mt-4">
        <h3 class="text-lg font-semibold">Spécifiques</h3>
        <Dialog>
            <div class="flex flex-col mx-6">
                <DialogTrigger>
                    <Button
                        @click="SpecificForm.specific = null"
                        class="w-min whitespace-nowrap flex justify-center items-center gap-x-2"
                    >
                        <span>Ajouter une specificité</span>
                        <ion-icon
                            class="text-lg"
                            name="add-circle-outline"
                        ></ion-icon>
                    </Button>
                </DialogTrigger>
                <DataTable
                    v-if="specifics.length > 0"
                    :columns="columns"
                    :rows="specifics"
                    :page="page"
                    :actions="actions"
                    @emit-next-page="onNextPage"
                    @emit-previous-page="onPreviousPage"
                ></DataTable>
            </div>

            <DialogContent>
                <SpecificFormItem
                    :specific="SpecificForm.specific"
                    :productId="product.product.id"
                ></SpecificFormItem>
            </DialogContent>
        </Dialog>
    </div>

    <div class="mt-4">
        <h3 class="text-lg font-semibold">Images</h3>
        <div class="flex flex-wrap gap-4 mt-2">
            <div v-for="image in images" :key="image.id" class="w-32 h-32">
                <img
                    :src="`/src/${image.path}`"
                    :alt="`Image ${image.id}`"
                    class="w-full h-full object-cover"
                />
            </div>
        </div>
    </div>
</template>
