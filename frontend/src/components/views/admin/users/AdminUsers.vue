<script setup lang="ts">
import DataTable from '@/components/tables/DataTable.vue';
import Button from '@/components/ui/button/Button.vue';
import  CollectionForm  from '@/components/views/admin/collections/CollectionForm.vue';
import {
Dialog,
DialogContent,
DialogTrigger
} from '@/components/ui/dialog';
import {  Page, TableActions, TableColumns, User } from '@types';
import { onMounted, reactive, ref } from 'vue';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const CollectionUrl = API_BASE_URL + '/users/'

const users = reactive<User[]>([])


const page = reactive<Page>({    
        current: 1,
        total: users.length,
        perPage: 5
    })

const columns: TableColumns[] = [
        {
            label: 'Nom',
            key: 'lastName',
            sorting: true,
        },

        {
            label: 'Prénom',
            key: 'firstName',
            sorting: true,
        },

        {
            label: 'email',
            key: 'email',
            sorting: true,
            toDisplay: (value: string) => {
                // anonymize email
                const [name, domain] = value.split('@')
                return `${name.slice(0, 2)}...@${domain}`
            },
        },

        {
            label: 'Role',
            key: 'role',
            sorting: true,
            toDisplay: (value: string) => {
                return value === 'admin' ? 'Administrateur' : 'Utilisateur'
            },
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
            label: 'Bannir',
            icon: 'ban-outline',
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
    data.users.forEach((u: any) => {
        console.log(u)
        users.push(u)
    })
    page.total = users.length
}

</script>
<template>
    <Dialog>
        <div class="flex flex-col mx-6">
            <DataTable 
                v-if="users.length > 0"
                :columns="columns"
                :rows="users"
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