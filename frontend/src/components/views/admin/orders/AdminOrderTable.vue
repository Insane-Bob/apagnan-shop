<script setup lang="ts">
import { useFilters } from '@/composables/useFilters'
import { useTable } from '@/composables/useTable'
import DataTable from '@components/tables/DataTable.vue'
import Filter from '@components/tables/Filter.vue'
import FilterItem from '@components/tables/FilterItem.vue'
import { Dialog } from '@components/ui/dialog'
import { useToast } from '@components/ui/toast'
import { TableColumns, User } from '@types'
import { computed } from 'vue'


const { toast } = useToast()

const { filters, query } = useFilters({
    status: [],
    customerId: [],
})
const { fetch, rows, pagination, sorting } = useTable('/orders', query)

const columns: TableColumns[] = [
    {
        label: 'Order',
        key: 'id',
        sorting: true,
    },

    {
        label: 'Client',
        key: 'Customer',
        sorting: false,
        toDisplay: (customer: { User: User }) => {
            return `${customer.User.firstName} ${customer.User.lastName}`
        },
    },

    {
        label: 'Statut',
        key: 'status',
        sorting: false,
    },
    {
        label: 'Nombre de produits',
        key: 'nbProducts',
        sorting: false,
    },

    {
        label: 'Total',
        key: 'total',
        sorting: false,
        toDisplay: (value: number) => `${value} €`,
    },

    {
        label: 'Date de création',
        key: 'createdAt',
        sorting: true,
        position: 'right',
        toDisplay: (value: string) =>
            new Date(value.slice(0, value.indexOf('T'))).toLocaleDateString(
                'fr-FR',
                { year: 'numeric', month: 'long', day: 'numeric' },
            ),
    },
]

const customers = computed(() => {
    let customers = rows.value.map((row: any) => {
        return {
            value: row.Customer.id,
            label: `${row.Customer.User.firstName} ${row.Customer.User.lastName}`,
        }
    })
    return customers.filter(
        (v, i, a) => a.findIndex((t) => t.value === v.value) === i,
    )
})
</script>
<template>
    <Dialog>
        <div class="flex flex-col mx-6 gap-4">
            <div class="flex gap-4 items-center">
                <Filter label="Statut" v-model="filters.status">
                    <FilterItem value="pending" label="En attente" />
                    <FilterItem value="shipped" label="En livraison" />
                    <FilterItem value="delivered" label="Livré" />
                    <FilterItem value="cancelled" label="Annulé" />
                    <FilterItem value="refunded" label="Remboursé" />
                </Filter>
                <Filter label="Client" v-model="filters.customerId">
                    <FilterItem
                        v-for="customer in customers"
                        :label="customer.label"
                        :value="customer.value"
                    />
                </Filter>
            </div>
            <DataTable
                :columns="columns"
                :rows="rows"
                :pagination="pagination"
                :sorting="sorting"
            >
            </DataTable>
        </div>
    </Dialog>
</template>
