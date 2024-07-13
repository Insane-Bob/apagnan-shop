<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'

if (window.opener) {
    window.opener.postMessage("success", '*');
    window.close();
}
</script>

<template>
    <div class="h-[90vh] w-full flex flex-col items-center justify-center">
        <h1 class="text-2xl uppercase tracking-wider text-center">Paiement accepté <br /> Merci pour votre achat</h1>
        <Button class="mt-4" to="/">Retour à l'accueil</Button>
    </div>
</template>