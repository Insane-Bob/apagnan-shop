<script setup lang="ts">
import DataTable from '@/components/tables/DataTable.vue';
import { apiClient } from '@/lib/apiClient';
import type { Order, TableColumns  } from '@/types';
import type { OrderStatus } from '@/types/OrderStatus';
import { useUserStore } from '@store/user';
import { onMounted, reactive, ref } from 'vue';
import Button from '../ui/button/Button.vue';
import type { TableActions } from '@/types';
import { useRouter } from 'vue-router';

const router = useRouter()
const user = useUserStore()
const loading = ref(true)

const orders = reactive<Order[]>([])

const statusTranslate = {
    'pending': 'En attente',
    'shipped': 'Expédiée',
    'delivered': 'Livrée',
    'refund': 'Remboursée',
    'cancelled': 'Annulée',

}


const columns: TableColumns[] = [
        {
            label: 'Crée le',
            key: 'createdAt',
            sorting: true,
            sortingType: 'date',
            toDisplay: (value: string) => {
                return new Date(value.slice(0, value.indexOf('T'))).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
            }
        },
        {
            label: 'Nombre d\'article',
            key: 'orderDetails',
            sorting: true,
            toDisplay: (value: any) => {
                return value.length + ' article(s)'
            }
        },
        {
            label: 'Total',
            key: 'orderDetails',
            sorting: true,
            toDisplay: (value: any) => {
                return value.map((detail: {total: number}) => detail.total).reduce((a: number, b: number) => a + b, 0) + ' €'
            }
        },
        {
            label: 'Status',
            key: 'status',
            sorting: true,
            toDisplay:  (value: OrderStatus) => {
                return statusTranslate[value]
            }
        },
    ]
    
const actions: TableActions[] = [
        {
            label: 'Voir le détail',
            icon: 'eye-outline',
            class: 'text-blue-500',
            action: (row: any) => {
                router.push('/profile/command/' + row.id)
            },
        },
]

onMounted(async () => {
    await fetchOrders()
    loading.value = false
})

const fetchOrders = async () => {
    const response = await apiClient.get('/users/'+ user.getId + '/orders')
    const data =  response.data
    console.log(data)
    data.forEach((c: any) => {
        orders.push(c)
    })
}



</script>
<template>
    <div v-if="!loading" class="flex flex-col mx-6 mt-24">
        <h1 class="text-2xl font-bold uppercase tracking-wider">Mes commandes</h1>
        <DataTable 
            v-if="orders.length > 0"
            :columns="columns"
            :rows="orders"
            :actions="actions"
        ></DataTable>
        <div v-else class="h-[80vh]">
            <h2>
                Vous n'avez pas encore passé de commande
            </h2>
            <div class="flex flex-col gap-y-7 justify-center items-center mt-6">
                <img src="/src/assets/images/goToShop.webp" alt="aller dans la boutique" class="w-1/2 h-1/2 object-cover rounded-sm">
                <RouterLink to="/products"><Button>Aller dans la boutique</Button></RouterLink>
            </div>
        </div>
    </div>
</template>