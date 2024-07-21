<script setup lang="ts">
import { ApiClient } from '@/lib/apiClient'
import DataTable from '@components/tables/DataTable.vue'
import { TableActions, TableColumns, User } from '@types'
import { useToast } from '@/components/ui/toast'
import { useUserStore } from '@/stores/user'
import { useTable } from '@/composables/useTable'
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'
import Filter from '@components/tables/Filter.vue'
import FilterItem from '@components/tables/FilterItem.vue'
import { useFilters } from '@/composables/useFilters'
import {computed, watch} from "vue";
import {useRoute} from "vue-router";

const apiClient = new ApiClient()

const user = useUserStore()
const { toast } = useToast()

const route = useRoute()
const filterId = computed(() => route.query.id || '')
const { filters, query } = useFilters({
    role: [],
    search: '',
    id: filterId.value
})
watch(filterId, () => {
  filters.id = filterId.value
})



const { rows, pagination, sorting,fetch } = useTable('/users', query)

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
        action: async (row: any) => {
            await  apiClient.delete('users/' + row.id)
            toast({
                title: 'Utilisateur banni',
            })
            await fetch()
        },
    },
]
const loginAs = async (id: number) => {
    try {
        const response = await apiClient.post('users/ask-login-as/' + id)
        if (response.status !== 200) {
            toast({
                title: 'Une erreur est arrivé',
                variant: 'destructive',
            })
            return
        }
        const accessLink = response.data.a

        const loginResponse = await apiClient.get('login/' + accessLink)

        if (loginResponse.data.accessToken && loginResponse.data.refreshToken) {
            const oldAccessToken = localStorage.getItem('accessToken') || ''
            const oldRefreshToken = localStorage.getItem('refreshToken') || ''

            localStorage.setItem('accessToken', loginResponse.data.accessToken)
            localStorage.setItem(
                'refreshToken',
                loginResponse.data.refreshToken,
            )

            localStorage.setItem('oldAccessToken', oldAccessToken)
            localStorage.setItem('oldRefreshToken', oldRefreshToken)

            const newMe = await apiClient.get('me')

            user.setUser(newMe.data.user)
            user.setLoggedAs(true)

            window.location.href = '/home'
        }
    } catch (e) {
        toast({
            title: 'Une erreur est arrivé',
            variant: 'destructive',
        })
        return
    }
}
</script>
<template>
    <div class="flex flex-col mx-6 gap-4">
        <div class="flex gap-4 items-center">
            <OutlinedInput
                class="max-w-[200px]"
                placeholder="Recherche"
                v-model="filters.search"
            >
            </OutlinedInput>
            <Filter label="Role" v-model="filters.role">
                <FilterItem value="admin" label="Administrateur" />
                <FilterItem value="store_keeper" label="Gestion des stock" />
                <FilterItem value="user" label="Utilisateur" />
            </Filter>
        </div>
        <DataTable
            :columns="columns"
            :rows="rows"
            :pagination="pagination"
            :sorting="sorting"
            :actions="actions"
        ></DataTable>
    </div>
</template>
