<script setup lang="ts">
import { apiClient } from '@/lib/apiClient';
import DataTable from '@components/tables/DataTable.vue';
import { Page, TableActions, TableColumns, User } from '@types';
import { onMounted, reactive } from 'vue';
import { useToast } from '@/components/ui/toast';
import { useUserStore } from '@/stores/user';


const users = reactive<User[]>([])
const user = useUserStore()
const {toast} = useToast()

const page = reactive<Page>({
    current: 1,
    total: users.length,
    perPage: 5,
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
        toDisplay: (value: string) =>
            new Date(value.slice(0, value.indexOf('T'))).toLocaleDateString(
                'fr-FR',
                { year: 'numeric', month: 'long', day: 'numeric' },
            ),
    },
]

const actions: TableActions[] = [
    {
        label: 'Se connecter en tant que',
        icon: 'glasses-outline',
        class: 'text-blue-500',
        action: (row: any) => {
            loginAs(row.id)
        },
    },
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
    page.current++
}

function onPreviousPage() {
    page.current--
}

onMounted(() => {
    fetchCollections()
})

const fetchCollections = async () => {
    const response = await apiClient.get('/users')
    const data = await response.data
    data.users.forEach((u: any) => {
        console.log(u)
        users.push(u)
    })
    page.total = users.length
}

const loginAs= async(id: number) => {
    const response = await apiClient.post('users/ask-login-as/'+id)
    console.log(response)
    if(response.status !== 200){
        toast({
            title: 'Une erreur est arrivé',
            variant: 'destructive'
        })
        return;
    }
    const accessLink = response.data.a

    const loginResponse = await apiClient.get('login/' + accessLink)

    if(loginResponse.data.accessToken && loginResponse.data.refreshToken){
        const oldAccessToken = localStorage.getItem('accessToken') || ''
        const oldRefreshToken = localStorage.getItem('refreshToken') || ''

        localStorage.setItem('accessToken', loginResponse.data.accessToken)
        localStorage.setItem('refreshToken', loginResponse.data.refreshToken)

        localStorage.setItem('oldAccessToken', oldAccessToken)
        localStorage.setItem('oldRefreshToken', oldRefreshToken)

        const newMe = await apiClient.get('me');

        user.setUser(newMe.data.user)
        user.setLoggedAs(true)

        window.location.href = '/home' 

    }

}
</script>
<template>
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
</template>
