<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import CardDescription from '../ui/card/CardDescription.vue';
import { apiClient } from '@/lib/apiClient';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { Order } from '@/types';

const options = { year: 'numeric', month: 'long', day: 'numeric' }

const route = useRoute()

const stapes = ref<{status: string, date: Date, description: string}[]>([])

const order = ref<Order>()
const shippingAddress = ref<string>()


const statusTranslate = {
    'pending': 'En attente',
    'shipped': 'Expédiée',
    'delivered': 'Livrée',
    'refund': 'Remboursée',
    'cancelled': 'Annulée',

}

const statusDescription = {
    'pending': 'Votre nain est en cours de préparation',
    'shipped': 'Votre nain est en route',
    'delivered': 'Votre nain est arrivé à destination',
    'refund': 'Votre nain a été remboursé',
    'cancelled': 'Votre nain a été annulé'
}

onMounted( async () => {
    const response = await apiClient.get('/orders/' + route.params.id)
    order.value = response.data

    shippingAddress.value =  order.value?.shipping_address.street + ', ' + order.value?.shipping_address.region + ', ' + order.value?.shipping_address.city

    if(order.value){
        if(order.value?.status !== 'pending'){
            stapes.value.push({status: 'Commande enregistrée', date: new Date(order.value?.createdAt as string), description: statusDescription['pending']})
        }
        stapes.value.push({status: statusTranslate[order.value.status], date: new Date(order.value?.updatedAt as string), description: statusDescription[order.value.status]})
    }
})
</script>

<template>
    <div class="mt-24 w-screen px-4 sm:px-16 lg:px-24">
        <div class="pt-12 pb-10">
            <h1 class="text-xl sm:text-2xl lg:text-4xl tracking-wider">Suivi de la commande <b>n°{{ order?.id }}</b></h1>
        </div>

        <div class="flex flex-col-reverse lg:flex-row flex-nowrap h-full gap-x-4">
            <menu class="flex-1 flex flex-col gap-y-3">
                <Card v-for="(stape, index) in stapes" :key="index" class="border rounded-sm w-full border-primary-accent px-4 border-l-8 border-r-primary shadow">
                    <CardHeader class="flex flex-row gap-x-2 items-center px-2 border-dashed border-b border-primary">{{ stape.status }} le <b>{{ stape.date.toLocaleDateString(options) + ' - ' + stape.date.toLocaleTimeString() }}</b></CardHeader>
                    <CardDescription class="px-2 py-4 italic">{{ stape.description }}</CardDescription>
                </Card>

            </menu>

            <hr class="w-full border-t-2 border-dashed border-primary lg:hidden my-4">

            <div class="flex-1 rounded-sm pt-2 px-2">
                <div class="rounded-sm border border-primary-accent">
                    <div style="width: 100%"><iframe width="720" height="600" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?width=720&amp;height=600&amp;hl=en&amp;q=242%20Rue%20du%20Faubourg%20Saint-Antoine,%2075012%20Paris+()&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/">gps systems</a></iframe></div>
                </div>
                <div class="flex flex-col space-y-2">
                    <h2 class="mt-4 text-3xl tracking-wider">Les informations de votre commande</h2>
                    <div>
                        <h2 class="text-xl tracking-wider">Où votre nain doit aller:</h2>
                        <p class="text-slate-600 italic">{{ shippingAddress }}</p>
                    </div>
                    <div>
                        <h2 class="text-xl tracking-wider">Date d'achat:</h2>
                        <p class="text-slate-600 italic">{{ new Date(order?.createdAt as string).toLocaleDateString(options) + ' - ' + new Date(order?.createdAt as string).toLocaleTimeString()}}</p>
                    </div>
                    <div>
                        <h2 class="text-xl tracking-wider">Date de livraison prévue:</h2>
                        <p class="text-slate-600 italic">28/01/2023 12h-16h</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>