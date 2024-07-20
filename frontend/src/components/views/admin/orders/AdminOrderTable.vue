<script setup lang="ts">
import { useFilters } from '@/composables/useFilters'
import { useTable } from '@/composables/useTable'
import DataTable from '@components/tables/DataTable.vue'
import { Dialog } from '@components/ui/dialog'
import { type TableColumns, type User } from '@types'
import FilterItem from '@components/tables/FilterItem.vue'
import Filter from '@components/tables/Filter.vue'
import {computed, onMounted, ref} from 'vue'
import {useFetch} from "@/composables/useFetch";
import type {Order, TableActions} from "@/types";


const { filters, query } = useFilters({
    status: [],
    customerId: [],
    id: "",
})
const {  rows, pagination, sorting, fetch } = useTable('/orders', query)

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
        toDisplay: (value: number) => OrderFormat.formatOrderNumber(value),
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

const orderSelected = ref<Order | null>(null)
const orderEditDialogOpen = ref(false)
const actions: TableActions[] = [
    {
    label: 'Changer le statut',
    icon: 'sync-outline',
    class: 'text-blue-500',
    action: async (row: Order) => {
      orderSelected.value = row
      orderEditDialogOpen.value = true
    },
    condition: (row: Order) => row.status !== 'cancelled' && row.status !== 'refunded' && row.status !== 'delivered'
  },
]


</script>
<template>
  <div class="flex flex-col mx-6 gap-4">
    <div class="flex gap-4 items-center">
      <OutlinedInput
          class="max-w-[200px]"
          v-model="filters.id"
          placeholder="Numéro de commande"
          type="number"/>
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
        :actions="actions"
    >
    </DataTable>
  </div>
    <Dialog v-model:open="orderEditDialogOpen">
      <OrderUpdateForm :order="orderSelected" v-if="orderSelected" @close="()=>{
        orderEditDialogOpen = false
        orderSelected = null
        fetch()
      }"/>
    </Dialog>
</template>
