<script setup lang="ts">
import DataTable from '@/components/tables/DataTable.vue'
import Button from '@/components/ui/button/Button.vue'
import ProductForm from '@/components/views/admin/products/ProductForm.vue'
import { onMounted, reactive } from 'vue'
import { Product, Page, TableColumns, TableActions } from '@types'
import { useRouter } from 'vue-router'
import { apiClient } from '@/lib/apiClient'

const router = useRouter()
const products = reactive<Product[]>([])

const page = reactive<Page>({
    current: 1,
    total: products.length,
    perPage: 10,
})

const columns: TableColumns[] = [
    {
        label: 'Nom',
        key: 'name',
        sorting: true,
    },
    {
        label: 'Prix (€)',
        key: 'price',
        sorting: true,
    },
    {
        label: 'Stock',
        key: 'stock',
        sorting: true,
    },
    {
        label: 'Publié',
        key: 'published',
        toDisplay: (value: boolean) => (value ? 'Oui' : 'Non'),
        sortingType: 'boolean',
        sorting: true,
    },
    {
        label: 'Date de création',
        key: 'createdAt',
        toDisplay: (value: string) =>
            new Date(value.slice(0, value.indexOf('T'))).toLocaleDateString(
                'fr-FR',
                { year: 'numeric', month: 'long', day: 'numeric' },
            ),
    },
    {
        label: 'Collection',
        key: 'collectionId',
        sorting: true,
    },
]

const actions: TableActions[] = [
    {
        label: 'Modifier',
        icon: 'document-text-outline',
        class: 'text-blue-500',
        action: (product: Product) => {
            router.push('/admin/products/' + product.slug)
        },
    },
    {
        label: 'Supprimer',
        icon: 'trash-outline',
        class: 'text-red-500',
        action: (product: Product) => {
            deleteProduct(product)
        },
    },
]

function onNextPage() {
    page.current++
}

function onPreviousPage() {
    page.current--
}

onMounted(() => {
    fetchProducts()
})

const deleteProduct = async (product: Product) => {
    // TODO : Replace delete with soft delete (update product to set deletedAt)
    const response = await apiClient.delete('products/' + product.slug)
}

const fetchProducts = async () => {
    const response = await apiClient.get('products')
    const data = await response.data
    products.push(...data.products)
    page.total = data.length
}
</script>

<template>
    <div v-if="!$route.params.slug" class="flex flex-col mx-6">
        <Button
            @click="router.push('/admin/products/new')"
            class="w-min whitespace-nowrap flex justify-center items-center gap-x-2"
        >
            <span>Créer un nouveau produit</span>
            <ion-icon class="text-lg" name="add-circle-outline"></ion-icon>
        </Button>
        <DataTable
            v-if="products.length > 0"
            :columns="columns"
            :rows="products"
            :actions="actions"
            :page="page"
            @emit-next-page="onNextPage"
            @emit-previous-page="onPreviousPage"
        ></DataTable>
    </div>
    <ProductForm :cslug="$route.params.slug" v-else></ProductForm>
</template>
