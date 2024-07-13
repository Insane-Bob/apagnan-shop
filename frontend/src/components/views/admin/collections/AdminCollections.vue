<script setup lang="ts">
import DataTable from '@/components/tables/DataTable.vue';
import Button from '@/components/ui/button/Button.vue';
import  CollectionForm  from '@/components/views/admin/collections/CollectionForm.vue';
import {
Dialog,
DialogContent,
DialogTrigger
} from '@/components/ui/dialog';
import { Collection, Page, TableActions, TableColumns } from '@types';
import { onMounted, reactive, ref } from 'vue';
import { apiClient } from '@/lib/apiClient';

const collections = reactive<Collection[]>([])

const form = reactive<{collection: Collection | null}>({
    collection: null,
    
})


const page = reactive<Page>({    
        current: 1,
        total: collections.length,
        perPage: 5
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
            toDisplay: (value: boolean) => value ? 'Oui' : 'Non',
        },

        {
            label: 'Publié',
            key: 'published',
            toDisplay: (value: boolean) => value ? 'Oui' : 'Non',
            sortingType: 'boolean',
            position: 'right',
            sorting: true,
        },

        {
            label: 'Date de création',
            key: 'createdAt',
            position: 'right',
            toDisplay: (value: string) => new Date(value.slice(0, value.indexOf('T'))).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }),
        },
    ]


const actions: TableActions[] = [
        {
            label: 'Ne plus mettre en avant',
            icon: 'star',
            class: 'text-yellow-500',
            condition: (row: any) => row.promoted,
            action: (row: any) => {
            updateCollection({...row, promoted: false})
            },
        },
        {
            label: 'Mettre en avant',
            icon: 'star-outline',
            class: 'text-yellow-500',
            condition: (row: any) => !row.promoted,
            action: (row: any) => {
            removeOldPromoted()
            updateCollection({...row, promoted: true})
            },
        },
        {
            label: 'Retirer la publication',
            icon: 'eye-off-outline',
            class: 'text-orange-500',
            condition: (row: any) => row.published,
            action: (row: any) => {
            updateCollection({...row, published: false})
            },
        },
        {
            label: 'Publier',
            icon: 'eye-outline',
            class: 'text-green-500',
            condition: (row: any) => !row.published,
            action: (row: any) => {
            updateCollection({...row, published: true})
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
            action: (row: any) => {
                console.log('Supprimer', row)
            },
        },
    ]

function onNextPage() {
    page.current++;
}

function onPreviousPage() {
    page.current--;
}

onMounted(() => {
    fetchCollections()
})

const fetchCollections = async () => {
    const response = await apiClient.get('collections')
    const data = await response.data
    data.collections.forEach((c: any) => {
        collections.push(c)
    })
    page.total = collections.length
}

const updateCollection = async (row: any) => {
    console.log(row)
    const response = await apiClient.patch('collections/' + row.slug, row)
    const data = response.data
    console.log('result',data.collection)
    collections.splice(collections.findIndex((c: any) => c.slug === row.slug), 1, data.collection)
}

const reloadCollection = (collection: Collection) => {
    if (form.collection) {
        collections.splice(collections.findIndex((c: any) => c.slug === form.collection.slug), 1, collection)
    } else {
        collections.push(collection)
    }
    form.collection = null

    page.total = collections.length
}

const removeOldPromoted = () => {
    const oldPromoted = collections.find((c: any) => c.promoted)
    if (oldPromoted) {
        updateCollection({...oldPromoted, promoted: false})
    }
}

</script>
<template>
    <Dialog>
        <div class="flex flex-col mx-6">
            <DialogTrigger>
                <Button @click="form.collection = null"  class="w-min whitespace-nowrap flex justify-center items-center gap-x-2">
                    <span>Créer une nouvelle collection</span>
                    <ion-icon class="text-lg" name="add-circle-outline"></ion-icon>
                </Button>
            </DialogTrigger>
            <DataTable 
                v-if="collections.length > 0"
                :columns="columns"
                :rows="collections"
                :page="page"
                :actions="actions"
                @emit-next-page="onNextPage"
                @emit-previous-page="onPreviousPage"
            ></DataTable>
        </div>

        <DialogContent>
            <CollectionForm :collection="form.collection" @reload-collection="reloadCollection"></CollectionForm>
        </DialogContent>
    </Dialog>
</template>