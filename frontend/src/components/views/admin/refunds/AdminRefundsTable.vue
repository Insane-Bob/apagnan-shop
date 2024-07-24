<script setup lang="ts">
import DataTable from '@components/tables/DataTable.vue'
import { Dialog } from '@components/ui/dialog'
import { TableActions, TableColumns, User } from '@types'
import { ApiClient } from '@/lib/apiClient'
import { useToast } from '@components/ui/toast'
import { useTable } from '@/composables/useTable'
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'
import FilterItem from '@components/tables/FilterItem.vue'
import Filter from '@components/tables/Filter.vue'
import { useFilters } from '@/composables/useFilters'
import { computed } from 'vue'

const apiClient = new ApiClient()

const { toast } = useToast()

const { filters, query } = useFilters({
    approved: [],
    search: '',
    customersIds: [],
})
const { fetch, rows, pagination, sorting, exportCSV } = useTable(
    '/refunds',
    query,
)

const columns: TableColumns[] = [
    {
        label: 'Order',
        key: 'orderId',
        sorting: true,
        to: (row) => `/admin/orders?id=${row.orderId}`,
    },

    {
        label: 'Raison',
        key: 'reason',
        sorting: true,
    },

    {
        label: 'Approuvé',
        key: 'approved',
        sorting: true,
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

const actions: TableActions[] = [
    {
        label: 'Approuver',
        icon: 'checkmark-circle',
        class: 'text-gray-400',
        action: async (row: any) => {
            try {
                await apiClient.post(`/refunds/${row.id}/approve`)
            } catch (e) {
                toast({
                    title: 'Erreur',
                    description: 'Une erreur est survenue',
                    status: 'error',
                })
            } finally {
                fetch()
            }
        },
    },
]

const customers = computed(() => {
    let customers = rows.value.map((row: any) => {
        return {
            value: row.Order.Customer.id,
            label: `${row.Order.Customer.User.firstName} ${row.Order.Customer.User.lastName}`,
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
                <OutlinedInput
                    class="max-w-[200px]"
                    placeholder="Recherche"
                    v-model="filters.search"
                >
                </OutlinedInput>

                <Filter label="Approuvé" v-model="filters.approved">
                    <FilterItem :value="1" label="oui" />
                    <FilterItem :value="0" label="non" />
                </Filter>
                <Filter label="Client" v-model="filters.customersIds">
                    <FilterItem
                        :value="customer.value"
                        :label="customer.label"
                        v-for="customer in customers"
                    />
                </Filter>
            </div>
            <DataTable
                :columns="columns"
                :rows="rows"
                :actions="actions"
                :pagination="pagination"
                :sorting="sorting"
                :export="exportCSV"
            >
                <template #row:approved="{ row: { approved } }">
                    <div v-if="approved">
                        <ion-icon
                            name="checkmark-circle"
                            class="text-green-500"
                        ></ion-icon>
                        Approuvé
                    </div>
                    <div v-else>
                        <ion-icon
                            name="hourglass-outline"
                            class="text-orange-500"
                        ></ion-icon>
                        En attente
                    </div>
                </template>
            </DataTable>
        </div>

        <!--        <DialogContent>-->
        <!--            <CollectionForm-->
        <!--                :collection="form.collection"-->
        <!--                @reload-collection="reloadCollection"-->
        <!--            ></CollectionForm>-->
        <!--        </DialogContent>-->
    </Dialog>
</template>
