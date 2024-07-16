<script setup lang="ts">
import {useRoute} from "vue-router";
import {usePaymentBroadcastChannel} from "@/composables/usePaymentBroadcastChannel";

if (window.opener) {
  const route = useRoute()
  const {send} = usePaymentBroadcastChannel()
  send({
      type: 'payment',
      status: 'fail',
      orderId: route.query.orderId
  })
  window.close()
}
</script>

<template>
    <div class="h-[90vh] w-full flex flex-col items-center justify-center">
        <h1 class="text-2xl uppercase tracking-wider text-center">
            Paiement refusé <br />
            Envoyé un message à notre support
        </h1>
    </div>
</template>
