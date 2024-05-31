<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const emit = defineEmits(['close']);

defineProps(['isOpen']);

</script>

<template>
    <div v-if="isOpen" class="block sm:hidden z-50 fixed h-screen w-screen bg-black/60 duration-200">
        <div class="flex flex-col justify-center items-center h-full">
            <ion-icon name="close-outline" class="text-white text-4xl cursor-pointer absolute top-5 right-5" @click="emit('close')" ></ion-icon>
            <nav class="flex flex-col gap-y-6 items-center">
                <router-link to="/" class="text-white text-2xl">Accueil</router-link>
                <router-link to="/shop" class="text-white text-2xl">Boutique</router-link>
                <router-link to="/contact" class="text-white text-2xl">Contact</router-link>
                <router-link to="/about" class="text-white text-2xl">A propos</router-link>
                <router-link to="/myprofile" class="text-white text-2xl">Mon compte</router-link>
            </nav>
        </div>
    </div>
</template>