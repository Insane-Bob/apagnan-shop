<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'

if (window.opener) {
    let channel = new BroadcastChannel('payment')
    channel.postMessage('fail')
    channel.close()
    window.close()
}
</script>

<template>
    <div class="h-[90vh] w-full flex flex-col items-center justify-center">
        <h1 class="text-2xl uppercase tracking-wider text-center">
            Paiement refusé <br />
            Envoyé un message à notre support
        </h1>
        <Button
            class="mt-4 cursor-not-allowed"
            to="/"
            variant="secondary"
            disabled
            >Envoyé un message</Button
        >
        <Button class="mt-4" to="/">Retour à l'accueil</Button>
    </div>
</template>
