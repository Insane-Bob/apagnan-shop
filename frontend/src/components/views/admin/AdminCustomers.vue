<script setup lang="ts">
import DataTable from '@/components/tables/DataTable.vue'
import AdminCustomer from '@/components/views/admin/AdminCustomer.vue'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { data as customerData } from './datas/customers'
const data = reactive(customerData)

const router = useRouter()

const page = reactive({
    current: 1,
    total: data.rows.length,
    perPage: 5,
})

const rows = reactive({ rows: data.rows })

const actions = [
    {
        label: 'Voir les commandes',
        icon: 'document-text-outline',
        class: 'text-blue-500',
        action: (row: any) => {
            router.push('/admin/customers/' + row.id)
        },
    },

    {
        label: 'bannir',
        icon: 'ban',
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

function affectSimpleAction(event: { callback: Function; row: any }) {
    data.rows = data.rows.map((row) => {
        if (row.id === event.row.id) {
            return event.callback(row)
        } else {
            return row
        }
    })
}

</script>
<template>
    <div v-if="!$route.params.id" div class="mx-8">
        <DataTable
            :columns="data.columns"
            :rows="rows.rows"
            :page="page"
            :actions="actions"
            @emit-next-page="onNextPage"
            @emit-previous-page="onPreviousPage"
            @simple-action="affectSimpleAction"
        ></DataTable>
    </div>

    <AdminCustomer v-else></AdminCustomer>
</template>
