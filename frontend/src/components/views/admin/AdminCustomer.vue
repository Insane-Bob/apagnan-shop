<script setup lang="ts">
import DataTable from '@/components/tables/DataTable.vue';
import { reactive, toDisplayString } from 'vue';
import { data as customerData } from './datas/customers'
import { useRoute } from 'vue-router'

const route = useRoute()

const data = reactive({customer: customerData.rows.find((row: any) => row.id == route.params.id)})

const columns = [
    {
        label: 'Id',
        key: 'id',
    },
    {
        label: 'Status',
        key: 'status',
        sorting: true,
        toDisplay: (value: string) => {
            switch(value){
                case 'sent':
                    return 'Expédié'
                case 'cancelled':
                    return 'Annulé'
                case 'pending':
                    return 'En attente'
                case 'received':
                    return 'Reçu'
                default:
                    return value
            }
        },
    },
    {
        label: 'Date d\'achat',
        key: 'createdAt',
        sorting: true,
        toDisplay: (value: Date) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' }
            return value.toLocaleDateString('fr-FR', options);
        },
        type: 'date'
    },
    {
        label: 'Total',
        key: 'price',
        sorting: true,
        toDisplay: (value: number) => {
            return value + ' €';
        }
    }
    
]

const options = { year: 'numeric', month: 'long', day: 'numeric' }

</script>
<template>
    <div class="mx-8">
        <div class="flex justify-between items-center">
            <h1 class="text-2xl font-bold">Customer</h1>
            <router-link to="/admin/customers" class="text-blue-500">Back to list</router-link>
        </div>
        <div class="mt-4">
            <div class="flex flex-col justify-between">
                <div class="flex gap-x-3 items-center">
                    <p class="text-lg font-semibold">Nom:</p>
                    <p class="font-thin">{{ data.customer?.firstname }} {{ data.customer?.lastname }}</p>
                </div>
                <div class="flex gap-x-3 items-center">
                    <p class="text-lg font-semibold">Email:</p>
                    <p class="font-thin">{{ data.customer?.email }}</p>
                </div>
                <div class="flex gap-x-3 items-center">
                    <p class="text-lg font-semibold">Role:</p>
                    <p class="font-thin">{{ data.customer?.type }}</p>
                </div>
                <div class="flex gap-x-3 items-center">
                    <p class="text-lg font-semibold">Date de création de compte:</p>
                    <p class="font-thin">{{ data.customer?.createdAt.toLocaleDateString('fr-FR', options) }}</p>
                </div>
            </div>
        </div>

        <div v-if="data.customer && data.customer.commands.length > 0">
            <h2 class="text-xl font-bold mt-8">Commandes</h2>
            <DataTable 
                :columns="columns"
                :rows="data.customer?.commands"
            ></DataTable>
        </div>
        <div v-else>
            <p class="mt-4">Aucune commande pour le moment</p>
        </div>
    </div>
    
</template>