<script setup lang="ts">
import DataTable from '@components/tables/DataTable.vue'
import { Dialog, DialogContent, DialogTrigger } from '@components/ui/dialog'
import { TableActions, TableColumns, User } from '@types'
import { onMounted, ref, watch } from 'vue'
import { apiClient } from '@/lib/apiClient'
import { usePagination } from '@/composables/usePagination'
import { useToast } from '@components/ui/toast'
import { useSort } from '@/composables/useSort'

const collection = ref<Object[]>([])

const collectionLength = ref(0)

const { toast } = useToast()
const {
    currentPage,
    dataTablePagination,
    query: paginatedQuery,
} = usePagination(collectionLength)

const { dataTableSort, sortQuery } = useSort()

const columns: TableColumns[] = [
    {
        label: 'Order',
        key: 'orderId',
        sorting: true,
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

onMounted(() => {
    fetch()
})

watch([currentPage, sortQuery], () => {
    fetch()
})

const fetch = async () => {
    try {
        const response = await apiClient.get(
            '/refunds?' +
                paginatedQuery.value.toString() +
                '&' +
                sortQuery.value.toString(),
        )
        collection.value = response.data.data
        collectionLength.value = response.data.total
    } catch (e) {
        console.error(e)
    }
}
</script>
<template>
    <Dialog>
        <div class="flex flex-col mx-6">
            <DataTable
                v-if="collection.length > 0"
                :columns="columns"
                :rows="collection"
                :actions="actions"
                :pagination="dataTablePagination"
                :sorting="dataTableSort"
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
