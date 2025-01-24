<script setup lang="ts">
import StarComponent from '@/components/product/StarComponent.vue'
import DataTable from '@/components/tables/DataTable.vue'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useFilters } from '@/composables/useFilters'
import { TableActions, TableColumns } from '@types'
import { ApiClient } from '@/lib/apiClient'
import { useTable } from '@/composables/useTable'
import type { Review } from '@/types'
import { ref } from 'vue'
import Filter from '@components/tables/Filter.vue'
import FilterItem from '@components/tables/FilterItem.vue'
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'
import { toast } from '@components/ui/toast'

const apiClient = new ApiClient()

const { filters, query } = useFilters({
    rate: [],
    approved: [],
    withProduct: 'true',
    withUser: 'true',
    search: '',
})

const focusReview = ref<Review | null>(null)

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
        maxWidth: '20vw',
        sorting: true,
    },
    {
        label: 'Auteur',
        key: 'User',
        toDisplay: (value: any) => value.email,
        to: (row) => `/admin/users?id=${row.User.id}`,
    },
    {
        label: 'Produit',
        key: 'Product',
        toDisplay: (value: any) => value.name,
        to: (row) => `/admin/products?id=${row.Product.id}`,
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
        position: 'right',
        sorting: true,
        toDisplay: (value: boolean) => (value ? 'Oui' : 'Non'),
    },
]

const actions: TableActions[] = [
    {
        label: 'Voir le commentaire',
        icon: 'eye-outline',
        class: 'text-blue-500',
        trigger: true,
        action: (row: any) => {
            focusReview.value = row
        },
    },
    {
        label: 'Approuver',
        icon: 'thumbs-up-sharp',
        class: 'text-green-500',
        condition: (row: any) => !row.approved,
        action: (row: any) => {
            updateReview({ ...row, approved: true })
        },
    },
    {
        label: 'Désapprouver',
        icon: 'thumbs-down-sharp',
        class: 'text-red-500',
        condition: (row: any) => row.approved,
        action: (row: any) => {
            updateReview({ ...row, approved: false })
        },
    },
]
const selected = ref([])
const multiActions = [
    {
        label: 'Approuver',
        action: (ids: any) => {
            updateMass(ids, true)
        },
    },
    {
        label: 'Désapprouver',
        action: (ids: any) => {
            updateMass(ids, false)
        },
    },
]

const updateReview = async (review: any) => {
    await apiClient.patch('/reviews/' + review.id, review)
    fetch()
}
function updateMass(ids: number[], approved: boolean) {
    ApiClient.handleError(async () => {
        const reviews = rows.value.filter((review: Review) =>
            ids.includes(review.id),
        )
        for (let review of reviews)
            await apiClient.patch('/reviews/' + review.id, {
                ...review,
                approved,
            })
        fetch()
        selected.value = []
        toast({
            title: 'Les commentaires ont été mis à jour',
        })
    })
}
</script>

<template>
    <Dialog>
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
                :multiActions="multiActions"
                v-model:selected="selected"
            ></DataTable>
        </div>

        <DialogContent>
            <div v-if="focusReview" class="flex flex-col gap-4">
                <div class="flex justify-between items-center">
                    <h2 class="text-xl font-bold">Commentaire</h2>
                    <DialogClose />
                </div>
                <div class="flex flex-col gap-4">
                    <div>
                        <h3 class="text-lg font-semibold">Produit</h3>
                        <p>{{ focusReview.Product.name }}</p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div
                                    class="text-lg font-medium mb-0 flex justify-start items-center gap-x-2"
                                >
                                    <StarComponent :value="focusReview.rate" />
                                    <span>
                                        -
                                        {{
                                            focusReview.User.firstName +
                                            ' ' +
                                            focusReview.User.lastName
                                        }}</span
                                    >
                                </div>
                            </CardTitle>
                            <CardDescription>
                                {{
                                    new Date(
                                        focusReview.createdAt,
                                    ).toLocaleDateString()
                                }}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {{ focusReview.content }}
                        </CardContent>
                    </Card>
                </div>
            </div>
            <div v-else>Il n'y a pas de commentaire sélectionné</div>
        </DialogContent>
    </Dialog>
</template>
