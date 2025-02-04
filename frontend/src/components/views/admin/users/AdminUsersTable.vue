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
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const apiClient = new ApiClient()

const user = useUserStore()
const { toast } = useToast()
const route = useRoute()

const selected = ref([])
const filterId = computed(() => route.query.id || '')
const { filters, query } = useFilters({
    role: [],
    search: '',
    id: filterId.value,
})
watch(filterId, () => {
    filters.id = filterId.value
})

const { rows, pagination, sorting, fetch, exportCSV } = useTable(
    '/users',
    query,
)

const groupedActionLabel = computed(() => {
    return selected.value.length <= 1
        ? 'Activer le compte'
        : 'Activer les comptes'
})

const groupedActions = [
    {
        label: groupedActionLabel,
        icon: 'flash-outline',
        class: 'text-red-500',
        action: (ids: number[]) => {
            massActivate(ids)
        },
    },
]

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
            if (value === 'admin') {
                return 'Administrateur'
            } else if (value === 'store_keeper') {
                return 'Gestion des stock'
            } else {
                return 'Utilisateur'
            }
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
        label: 'Changer le role',
        icon: 'sync',
        class: 'text-primary',
        action: () => {
            return
        },
        children: [
            {
                label: 'Administrateur',
                icon: 'ribbon-outline',
                class: 'text-primary',
                condition: (row: any) => {
                    console.log(row.role)
                    return row.role !== 'admin'
                },
                action: async (row: any) => {
                    await apiClient.patch('users/' + row.id, { role: 'admin' })
                    toast({
                        title: 'Role changé',
                    })
                    await fetch()
                },
            },
            {
                icon: 'storefront-outline',
                label: 'Gestion des stock',
                class: 'text-primary',
                condition: (row: any) => row.role !== 'store_keeper',
                action: async (row: any) => {
                    await apiClient.patch('users/' + row.id, {
                        role: 'store_keeper',
                    })
                    toast({
                        title: 'Role changé',
                    })
                    await fetch()
                },
            },
            {
                icon: 'person-outline',
                label: 'Utilisateur',
                condition: (row: any) => row.role !== 'user',
                action: async (row: any) => {
                    await apiClient.patch('users/' + row.id, { role: 'user' })
                    toast({
                        title: 'Role changé',
                    })
                    await fetch()
                },
            },
        ],
    },
    {
        label: 'Se connecter en tant que',
        icon: 'glasses-outline',
        class: 'text-blue-500',
        condition: (row: any) => row.id !== user.getId,
        action: (row: any) => {
            loginAs(row.id)
        },
    },
    {
        label: 'Supprimer',
        icon: 'trash-outline',
        class: 'text-red-500',
        condition: (row: any) => row.id !== user.getId,
        confirmation: {
            title: "Supprimer l'Utilisateur",
            message: 'Voulez-vous vraiment bannir cet utilisateur ?',
            styleConfirm: 'bg-red-500',
        },
        action: async (row: any) => {
            await apiClient.delete('users/' + row.id)
            toast({
                title: 'Utilisateur banni',
            })
            await fetch()
        },
    },
    {
        label: 'Activer',
        icon: 'flash-off-outline',
        class: 'text-slate-500',
        condition: (row: any) => row.id !== user.getId && !row.emailVerifiedAt,
        action: (row: any) => {
            activateUser(row)
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

function activateUser(row) {
    ApiClient.handleError(async () => {
        await apiClient.patch('/users/' + row.id, {
            emailVerifiedAt: new Date(),
        })
        fetch()
        toast({
            title: `L'utilisateur ${row.firstName} ${row.lastName} a bien été activé`,
        })
    })
}

function massActivate(ids: number[]) {
    ApiClient.handleError(async () => {
        for (let id of ids) {
            await apiClient.patch('/users/' + id, {
                emailVerifiedAt: new Date(),
            })
        }
        fetch()
        toast({
            title: `Les utilisateurs sélectionnés ont bien été activés`,
        })
    })
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
            v-model:selected="selected"
            :columns="columns"
            :multi-actions="groupedActions"
            :rows="rows"
            :pagination="pagination"
            :sorting="sorting"
            :actions="actions"
            :export="exportCSV"
        ></DataTable>
    </div>
</template>
