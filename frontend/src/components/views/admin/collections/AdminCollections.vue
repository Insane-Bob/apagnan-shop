<script setup lang="ts">
import { ref } from 'vue'
import DataTable from '@/components/tables/DataTable.vue'
import Button from '@/components/ui/button/Button.vue'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import CollectionForm from '@/components/views/admin/collections/CollectionForm.vue'
import { useFilters } from '@/composables/useFilters'
import { useTable } from '@/composables/useTable'
import { ApiClient } from '@/lib/apiClient'
import Filter from '@components/tables/Filter.vue'
import FilterItem from '@components/tables/FilterItem.vue'
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'
import { Collection, TableActions, TableColumns } from '@types'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { computed, watch } from 'vue'
import { toast } from '@components/ui/toast'

const apiClient = new ApiClient()
const route = useRoute()

const collectionModalOpen = ref(false)
const filterId = computed(() => route.query.id || '')
const { filters, query } = useFilters({
    published: [],
    search: '',
    withImage: true,
    withProductCount: true,
    id: filterId.value,
})
watch(filterId, () => {
    filters.id = filterId.value
})

const selected = ref([])
const { fetch, rows, pagination, sorting } = useTable('/collections', query)
const form = reactive<{ collection: Collection | null }>({
    collection: null,
})

const columns: TableColumns[] = [
    {
        label: 'Nom',
        key: 'name',
        sorting: true,
    },

    {
        label: 'Mise en Avant',
        key: 'promoted',
        sorting: true,
        toDisplay: (value: boolean) => (value ? 'Oui' : 'Non'),
    },

    {
        label: 'Publié',
        key: 'published',
        toDisplay: (value: boolean) => (value ? 'Oui' : 'Non'),
        sortingType: 'boolean',
        position: 'right',
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
]

const actions: TableActions[] = [
    {
        label: 'Ne plus mettre en avant',
        icon: 'star',
        class: 'text-yellow-500',
        condition: (row: any) => row.promoted,
        action: (row: any) => {
            updateCollection({ ...row, promoted: false })
        },
    },
    {
        label: 'Mettre en avant',
        icon: 'star-outline',
        class: 'text-yellow-500',
        condition: (row: any) => !row.promoted,
        action: (row: any) => {
            promoteCollection(row)
        },
    },
    {
        label: 'Retirer la publication',
        icon: 'eye-off-outline',
        class: 'text-orange-500',
        condition: (row: any) => row.published,
        action: (row: any) => {
            updateCollection({ ...row, published: false })
        },
    },
    {
        label: 'Publier',
        icon: 'eye-outline',
        class: 'text-green-500',
        condition: (row: any) => !row.published,
        action: (row: any) => {
            updateCollection({ ...row, published: true })
        },
    },
    {
        label: 'Modifier',
        icon: 'pencil-outline',
        class: 'text-blue-500',
        trigger: true,
        action: (row: Collection) => {
            form.collection = row
        },
    },

    {
        label: 'Suprimer',
        icon: 'trash-outline',
        class: 'text-red-500',
        confirmation: {
            title: 'Supprimer la collection',
            message: 'Êtes-vous sûr de vouloir supprimer cette collection ?',
            styleConfirm: 'bg-red-500',
        },
        condition: (row: any) => row.productCount == 0,
        action: (row: any) => {
            deleteCollection(row)
        },
    },

    {
        label: 'Il y a des produits, impossible de supprimer',
        icon: 'trash-outline',
        class: 'text-red-800 opacity-40',
        condition: (row: any) => row.productCount != 0,
        action: (row: any) => {},
    },
]

const groupedActions = [
    {
        label: 'Supprimer',
        icon: 'trash-outline',
        class: 'text-red-500',
        action(ids: number[]) {
            massDelete(ids)
        },
    },
]

const updateCollection = async (row: any) => {
    await apiClient.patch('collections/' + row.slug, row)
    fetch()
}

const promoteCollection = async (row: any) => {
    await apiClient.patch('collections/' + row.slug + '/promote')
    fetch()
}

const deleteCollection = async (row: any) => {
    await apiClient.delete('collections/' + row.slug)
    fetch()
}

async function massDelete(ids: number[]) {
    let collections = ids.map((id) => rows.value.find((row) => row.id === id))

    let hasProduct = collections.some(
        (collection) => collection.productCount != 0,
    )

    if (hasProduct) {
        toast({
            title: 'Impossible de supprimer',
            description:
                'Il y a des produits dans une ou plusieurs collections sélectionnées',
            variant: 'destructive',
        })
        return
    }

    for (let collection of collections)
        await apiClient.delete('collections/' + collection.slug)
    fetch()
    selected.value = []
}
</script>
<template>
    <Dialog v-model:open="collectionModalOpen">
        <div class="flex flex-col mx-6">
            <div class="flex justify-between items-center mb-3">
                <div class="flex gap-4 items-center">
                    <OutlinedInput
                        class="max-w-[200px]"
                        placeholder="Recherche"
                        v-model="filters.search"
                    >
                    </OutlinedInput>

                    <Filter label="Status" v-model="filters.published">
                        <FilterItem value="true" label="publié" />
                        <FilterItem value="false" label="non publié" />
                    </Filter>
                </div>
                <DialogTrigger>
                    <Button
                        @click="form.collection = null"
                        class="w-min whitespace-nowrap flex justify-center items-center gap-x-2"
                    >
                        <span>Créer une nouvelle collection</span>
                        <ion-icon
                            class="text-lg"
                            name="add-circle-outline"
                        ></ion-icon>
                    </Button>
                </DialogTrigger>
            </div>
            <DataTable
                :columns="columns"
                :rows="rows"
                :pagination="pagination"
                :sorting="sorting"
                :actions="actions"
                :multi-actions="groupedActions"
                v-model:selected="selected"
            ></DataTable>
        </div>

        <DialogContent>
            <CollectionForm
                :collection="form.collection"
                @close="
                    () => {
                        collectionModalOpen = false
                        fetch()
                    }
                "
            ></CollectionForm>
        </DialogContent>
    </Dialog>
</template>
