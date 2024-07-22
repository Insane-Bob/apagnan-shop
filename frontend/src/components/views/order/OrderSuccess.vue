<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import { useRoute } from 'vue-router'
import { usePaymentBroadcastChannel } from '@/composables/usePaymentBroadcastChannel'
import { useUserStore } from '@/stores/user'
import { onMounted } from 'vue'
import { ApiClient } from '@/lib/apiClient'

const user = useUserStore()
const apiClient = new ApiClient()
const route = useRoute()

onMounted(() => {
    apiClient.get(`/emails/order-supported/${route.query.orderId}`)
    user.clearCart
})

if (window.opener) {
    const { send } = usePaymentBroadcastChannel()
    send({
        type: 'payment',
        status: 'success',
        orderId: route.query.orderId,
    })
    window.close()
}
</script>

<template>
    <div class="h-[90vh] w-full flex flex-col items-center justify-center">
        <h1 class="text-2xl uppercase tracking-wider text-center">
            Paiement accepté <br />
            Merci pour votre achat
        </h1>
        <Button class="mt-4" to="/">Retour à l'accueil</Button>
    </div>
</template>
