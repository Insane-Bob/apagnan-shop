<script setup lang="ts">
import DataTable from '@/components/tables/DataTable.vue'
import Button from '@/components/ui/button/Button.vue'
import ProductForm from '@/components/views/admin/products/ProductForm.vue'
import { TableColumns, TableActions } from '@types'
import { useRoute, useRouter } from 'vue-router'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import StockForm from '../stocks/StockForm.vue'
import { ApiClient } from '@/lib/apiClient'
import { useFilters } from '@/composables/useFilters'
import { useTable } from '@/composables/useTable'
import Filter from '@components/tables/Filter.vue'
import FilterItem from '@components/tables/FilterItem.vue'
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'
import { computed, ref, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import type { Product } from '@/types'
import { toast } from '@/components/ui/toast'

const user = useUserStore()
const apiClient = new ApiClient()

const router = useRouter()
const route = useRoute()

const selected = ref([])

let filterId = computed(() => route.query.id || '')
const { filters, query } = useFilters({
    published: [],
    search: '',
    id: filterId.value,
})
watch(filterId, () => {
    filters.id = filterId.value
})

const { fetch, rows, pagination, sorting } = useTable('/products', query)
const selectedProduct = ref<Product | null>(null)

const groupedActions = [
    {
        label: 'Supprimer',
        icon: 'trash-outline',
        class: 'text-red-500',
        action(ids: number[]) {
            massDelete(ids)
        },
    },
]

const columns: TableColumns[] = [
    {
        label: 'Nom',
        key: 'name',
        sorting: true,
    },
    {
        label: 'Prix (TTC)',
        key: 'priceFormatted',
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
        to: (row) => `/admin/collections?id=${row.collectionId}`,
    },
]

const actions: TableActions[] = [
{
        label: 'Gérer les stocks',
        icon: 'sync-outline',
        class: 'text-blue-500',
        condition: () => user.isStoreKeeper,
        trigger: true,
        action: (row: any) => {
            selectedProduct.value = row
        },
    },
    {
        label: 'Modifier',
        icon: 'document-text-outline',
        class: 'text-blue-500',
        condition: () => user.isAdmin,
        action: (row: any) => {
            router.push('/admin/products/' + row.slug)
        },
    },
    {
        label: 'Supprimer',
        icon: 'trash-outline',
        class: 'text-red-500',
        condition: () => user.isAdmin,
        action: (row: any) => {
            deleteProduct({ ...row, deletedAt: new Date(), published: false })
        },
    },
]

const deleteProduct = (row: any) => {
    ApiClient.handleError(async () => {
        await apiClient.delete('/products/' + row.slug)
        fetch()
        toast({
            title: `Le produit ${row.name} a bien été supprimé`,
        })
    })
}

function massDelete(ids: number[]) {
    ApiClient.handleError(async () => {
        let query = new URLSearchParams({
            ids,
        })
        await apiClient.delete('/products?' + query.toString())
        fetch()
        toast({
            title: `Les produits sélectionnés ont bien été supprimés`,
        })
    })
}

const fetchProductData = async () => {
    if(!selectedProduct.value) return
    try{
        await apiClient.get('products/' + selectedProduct.value.slug + "?withImages")
    }catch(e){
        toast({
            title: 'Erreur',
            description: 'Une erreur est survenue lors de la récupération des données du produit',
            variant: 'destructive'
        })
    }
    fetch()
}
</script>

<template>
    <Dialog v-if="!$route.params.slug || user.isStoreKeeper">

        <div  class="flex flex-col mx-6">
            <div class="flex justify-between items-center mb-3">
                <div class="flex gap-4 items-center">
                    <OutlinedInput
                        class="max-w-[200px]"
                        placeholder="Recherche"
                        v-model="filters.search"
                    >
                    </OutlinedInput>

                    <Filter label="Status" v-model="filters.published">
                        <FilterItem value="true" label="Publié" />
                        <FilterItem value="false" label="Non publié" />
                    </Filter>
                </div>
                <Button
                    @click="router.push('/admin/products/new')"
                    class="w-min whitespace-nowrap flex justify-center items-center gap-x-2"
                >
                    <span>Créer un nouveau produit</span>
                    <ion-icon class="text-lg" name="add-circle-outline"></ion-icon>
                </Button>
            </div>
            <DataTable
                v-model:selected="selected"
                :multi-actions="groupedActions"
                :columns="columns"
                :rows="rows"
                :pagination="pagination"
                :sorting="sorting"
                :actions="actions"
            ></DataTable>
        </div>
        <DialogTrigger>
            <Button type="button" variant="outlineDashboard">Gestion du stock</Button>
        </DialogTrigger>
        <DialogContent>
            <StockForm
            :productId="selectedProduct?.id || 0"
            :actualStock="selectedProduct?.stock || 0"
            @stockUpdated="fetchProductData"
            ></StockForm>
        </DialogContent>
    </Dialog>
    <ProductForm :cslug="Array.isArray($route.params.slug)? $route.params.slug[0]: $route.params.slug" v-else></ProductForm>
</template>
