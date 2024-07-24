<script setup lang="ts">
import { ApiClient } from '@/lib/apiClient'
import { useFilters } from '@/composables/useFilters'
import type { TableActions, TableColumns } from '@/types'
import DataTable from '@components/tables/DataTable.vue'
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'
import AdminTableLayout from '@/layout/AdminTableLayout.vue'
import { useTable } from '@/composables/useTable'
import { useRoute, useRouter } from 'vue-router'
import AdminLegalForm from '@components/views/admin/Legals/AdminLegalForm.vue'
import { Button } from '@components/ui/button'

const { filters, query } = useFilters({
    search: '',
})

const { rows, pagination, sorting, fetch } = useTable(
    '/legals-documents',
    query,
)

const columns: TableColumns[] = [
    {
        label: 'Nom',
        key: 'name',
        sorting: true,
    },
    {
        label: 'Publié',
        key: 'published',
        toDisplay(value) {
            return value ? 'Oui' : 'Non'
        },
    },
    {
        label: 'Créer le',
        key: 'createdAt',
        toDisplay(value) {
            return new Date(value).toLocaleDateString()
        },
    },
    {
        label: 'Mis à jour le',
        key: 'createdAt',
        toDisplay(value) {
            return new Date(value).toLocaleDateString()
        },
    },
]

const router = useRouter()
const route = useRoute()

const actions: TableActions[] = [
    {
        label: 'Editer',
        icon: 'pencil-outline',
        action: (row) => {
            router.push(`${route.path}/${row.slug}`)
        },
    },
    {
        label: 'Supprimer',
        icon: 'trash-outline',
        action: (row) => {
            let client = new ApiClient()
            ApiClient.handleError(async () => {
                await client.delete(`/legals-documents/${row.slug}`)
                fetch()
            })
        },
        confirmation: {
            title: 'Supprimer le document',
            message: 'Êtes-vous sûr de vouloir supprimer ce document ?',
        },
    },
]
</script>

<template>
    <AdminTableLayout v-if="route.name == 'legalesIndex'">
        <template #filters>
            <OutlinedInput
                class="max-w-[200px]"
                placeholder="Recherche"
                v-model="filters.search"
            >
            </OutlinedInput>
        </template>
        <template #actions>
            <Button @click="router.push(`${route.path}/new`)">
                <ion-icon name="add-circle-outline" class="mr-2" /> Ajouter un
                document
            </Button>
        </template>
        <DataTable
            :columns="columns"
            :rows="rows"
            :pagination="pagination"
            :sorting="sorting"
            :actions="actions"
        ></DataTable>
    </AdminTableLayout>
    <AdminLegalForm
        @save="fetch"
        :document="rows.find((r) => r.slug == route.params.slug)"
        v-else
    />
</template>
