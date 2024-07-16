<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import {useRoute} from "vue-router";
import {usePaymentBroadcastChannel} from "@/composables/usePaymentBroadcastChannel";
import { useUserStore } from '@/stores/user';

const user = useUserStore()

user.setCart([])

if (window.opener) {
  const route = useRoute()
  const {send} = usePaymentBroadcastChannel()
  send({
    type: 'payment',
    status: 'success',
    orderId: route.query.orderId
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
