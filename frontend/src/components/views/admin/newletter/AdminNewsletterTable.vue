<script setup lang="ts">
import { useFilters } from '@/composables/useFilters'
import type { TableColumns } from '@/types'
import DataTable from '@components/tables/DataTable.vue'
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'
import AdminTableLayout from '@/layout/AdminTableLayout.vue'
import { useTable } from '@/composables/useTable'

const { filters, query } = useFilters({
    search: '',
})

const { rows, pagination, sorting } = useTable('/newsletter', query)

const columns: TableColumns[] = [
    {
        label: 'Email',
        key: 'email',
        sorting: true,
    },
    {
        label: 'Inscrit le',
        key: 'createdAt',
        toDisplay(value) {
            return new Date(value).toLocaleDateString()
        },
    },
]
</script>

<template>
    <AdminTableLayout>
        <template #filters>
            <OutlinedInput
                class="max-w-[200px]"
                placeholder="Recherche"
                v-model="filters.search"
            >
            </OutlinedInput>
        </template>
        <DataTable
            :columns="columns"
            :rows="rows"
            :pagination="pagination"
            :sorting="sorting"
        ></DataTable>
    </AdminTableLayout>
</template>

<style scoped></style>
