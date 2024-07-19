<script setup lang="ts">
import DataTable from '@/components/tables/DataTable.vue'
import { useFilters } from '@/composables/useFilters'
import { TableActions, TableColumns } from '@types'
import { apiClient } from '@/lib/apiClient'
import { useTable } from '@/composables/useTable'
import Filter from '@components/tables/Filter.vue'
import FilterItem from '@components/tables/FilterItem.vue'
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'
import { ref, watch } from 'vue'

const { filters, query, resetFilters } = useFilters({
    rate: [],
    approved: [],
    withProduct: 'true',
    withUser: 'true',
    search: '',
})

const { fetch, rows, pagination, sorting } = useTable('/reviews', query)

const columns: TableColumns[] = [
    {
        label: 'Note',
        key: 'rate',
        sorting: true,
    },
    {
        label: 'Contenu',
        key: 'content',
        sorting: true,
    },
    {
        label: 'Auteur',
        key: 'User',
        toDisplay: (value: any) => value.email,
        sorting: true,
    },
    {
        label: 'Produit',
        key: 'Product',
        toDisplay: (value: any) => value.name,
        sorting: true,
    },
    {
        label: 'Date de création',
        key: 'createdAt',
        position: 'right',
        toDisplay: (value: string) =>
            new Date(value.slice(0, value.indexOf('T'))).toLocaleDateString(
                'fr-FR',
                { year: 'numeric', month: 'long', day: 'numeric' },
            ),
    },
    {
        label: 'Approuvé',
        key: 'approved',
        sorting: true,
        toDisplay: (value: boolean) => (value ? 'Oui' : 'Non'),
    },
]

const actions: TableActions[] = [
    {
        label: 'Approuver',
        icon: 'checkmark-outline',
        class: 'text-green-500',
        condition: (row: any) => !row.approved,
        action: (row: any) => {
            updateReview({ ...row, approved: true })
        },
    },
    {
        label: 'Désapprouver',
        icon: 'ban',
        class: 'text-red-500',
        condition: (row: any) => row.approved,
        action: (row: any) => {
            updateReview({ ...row, approved: false })
        },
    },
]

const updateReview = async (review: any) => {
    await apiClient.patch('/reviews/' + review.id, review)
    fetch()
}
</script>

<template>
    <div class="flex flex-col mx-6">
        <div class="flex justify-between items-center mb-3">
            <div class="flex gap-4 items-center">
                <OutlinedInput
                    class="max-w-[200px]"
                    placeholder="Recherche"
                    v-model="filters.search"
                >
                </OutlinedInput>
                <Filter label="Note" v-model="filters.rate">
                    <FilterItem value="1" label="1" />
                    <FilterItem value="2" label="2" />
                    <FilterItem value="3" label="3" />
                    <FilterItem value="4" label="4" />
                    <FilterItem value="5" label="5" />
                </Filter>
                <Filter label="Status" v-model="filters.approved">
                    <FilterItem value="true" label="Approuvé" />
                    <FilterItem value="false" label="Non Approuvé" />
                </Filter>
            </div>
        </div>
        <DataTable
            :columns="columns"
            :rows="rows"
            :pagination="pagination"
            :sorting="sorting"
            :actions="actions"
        ></DataTable>
    </div>
</template>
