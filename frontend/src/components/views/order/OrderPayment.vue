<script setup lang="ts">

import { useRoute, useRouter } from 'vue-router'
import { apiClient } from '@/lib/apiClient'
import {useUserStore} from '@store/user'
import { onMounted, ref } from 'vue';
import Button from '@components/ui/button/Button.vue'

const user = useUserStore()
const route = useRoute()
const router = useRouter()

const orderId = route.params.id

const paymentLink = ref('')

onMounted(async () => {
    const response = await apiClient.post(`/orders/${orderId}/pay`)
    console.log(response.data)
    paymentLink.value = response.data.url
    if (response.data.user_id !== user.user.id) {
        router.push({ name: 'home' })
    }
})

const openPayment = () => {
    window.open(paymentLink.value, '_blank')
}

</script>

<template>
    <div class="flex flex-col justify-center items-center h-screen">
        <h1 v-if="!paymentLink" class="text-2xl uppercase tracking-wider mb-12">Veuillez Patienter nous recherchons un lien</h1>
        <h1 v-else class="text-2xl uppercase tracking-wider mb-12">Cliquer sur le Bouton afin de payer</h1>
        <Button @click="openPayment" :variant="paymentLink?'default': 'disabled'" class="uppercase tracking-wider">{{ paymentLink? 'Payer ici' : 'En attente...'}}</Button>
    </div>
</template>