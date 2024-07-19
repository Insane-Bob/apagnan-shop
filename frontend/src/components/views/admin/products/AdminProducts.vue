<script setup lang="ts">
import DataTable from '@/components/tables/DataTable.vue'
import Button from '@/components/ui/button/Button.vue'
import ProductForm from '@/components/views/admin/products/ProductForm.vue'
import { TableColumns, TableActions } from '@types'
import { useRouter } from 'vue-router'
import { ApiClient } from '@/lib/apiClient'
import { useFilters } from '@/composables/useFilters'
import { useTable } from '@/composables/useTable'
import Filter from '@components/tables/Filter.vue'
import FilterItem from '@components/tables/FilterItem.vue'
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'

const apiClient = new ApiClient()

const router = useRouter()
const { filters, query, resetFilters } = useFilters({
    published: [],
    search: '',
})

const { fetch, rows, pagination, sorting } = useTable('/products', query)

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
        action: (row: any) => {
            router.push('/admin/products/' + row.slug)
        },
    },
    {
        label: 'Supprimer',
        icon: 'trash-outline',
        class: 'text-red-500',
        action: (row: any) => {
            deleteProduct({ ...row, deletedAt: new Date(), published: false })
        },
    },
]

const deleteProduct = async (row: any) => {
    await apiClient.patch('/products/' + row.slug, row)
    fetch()
}
</script>

<template>
    <div v-if="!$route.params.slug" class="flex flex-col mx-6">
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
            :columns="columns"
            :rows="rows"
            :pagination="pagination"
            :sorting="sorting"
            :actions="actions"
        ></DataTable>
    </div>
    <ProductForm :cslug="$route.params.slug" v-else></ProductForm>
</template>
