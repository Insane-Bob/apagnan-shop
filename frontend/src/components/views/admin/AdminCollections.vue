<script setup lang="ts">
import DataTable from '@/components/tables/DataTable.vue';
import { Collection, TableColumns, Page, TableActions } from '@types';
import { onMounted, reactive } from 'vue';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const CollectionUrl = API_BASE_URL + '/collections/'

const collections = reactive<Collection[]>([])



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
            icon: 'document-text-outline',
            class: 'text-blue-500',
            action: (row: any) => {
            console.log('Modifier', row)
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
    const response = await fetch(CollectionUrl)
    const data = await response.json()
    data.collections.forEach((c: any) => {
        collections.push(c)
    })
}

const updateCollection = async (row: any) => {
    const response = await fetch(CollectionUrl + row.slug, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(row)
    })
    const data = await response.json()
    collections.splice(collections.findIndex((c: any) => c.slug === row.slug), 1, data.collection)
}

</script>
<template>
    
        <DataTable 
            v-if="collections.length > 0"
            :columns="columns"
            :rows="collections"
            :page="page"
            :actions="actions"
            @emit-next-page="onNextPage"
            @emit-previous-page="onPreviousPage"
        ></DataTable>
</template>