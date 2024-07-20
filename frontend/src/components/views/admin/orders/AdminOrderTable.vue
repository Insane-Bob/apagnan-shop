<script setup lang="ts">
import { useFilters } from '@/composables/useFilters'
import { useTable } from '@/composables/useTable'
import DataTable from '@components/tables/DataTable.vue'
import Filter from '@components/tables/Filter.vue'
import FilterItem from '@components/tables/FilterItem.vue'
import { Dialog } from '@components/ui/dialog'
import { type TableColumns, type User } from '@types'
import { useToast } from '@components/ui/toast'
import { useTable } from '@/composables/useTable'
import FilterItem from '@components/tables/FilterItem.vue'
import Filter from '@components/tables/Filter.vue'
import { useFilters } from '@/composables/useFilters'
import {computed, onMounted, ref} from 'vue'
import {useFetch} from "@/composables/useFetch";

const { toast } = useToast()

const { filters, query } = useFilters({
    status: [],
    customerId: [],
})
const {  rows, pagination, sorting } = useTable('/orders', query)

const customers = ref<{
    value: number
    label: string
}>([])


const fetchCustomers = useFetch(computed(() => '/users'), null, (data)=>{
    customers.value = data.data.map((user : User)=>({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`

    }))
})

onMounted(fetchCustomers.get)

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
                    <FilterItem value="paid" label="Payé" />
                    <FilterItem value="payment_failed" label="Paiement échoué" />
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
