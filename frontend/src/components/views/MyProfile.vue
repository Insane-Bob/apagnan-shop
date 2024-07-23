<template>
    <div class="relative">
        <main class="bg-white">
            <div class="flex flex-col justify-center items-center gap-4 mt-10">
                <h1 class="text-3xl font-bold text-gray-800">
                    Bienvenue sur votre espace personnel,
                    <span class="text-primary">
                        {{ user.user?.firstName }} {{ user.user?.lastName }}
                    </span>
                    !
                </h1>
                <p class="text-lg text-gray-600">
                    Nous sommes ravis de vous revoir.
                </p>
            </div>
            <div
                class="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center p-8 mt-8"
            >
                <LinkCard
                    to="/profile/informations"
                    name="Mes informations"
                    shortDescription="Modifiez vos informations personnelles"
                    image="/src/assets/images/profileMe.webp"
                    class="hover:text-primary"
                />
                <LinkCard
                    to="/profile/commands"
                    name="Mes commandes"
                    shortDescription="Consultez l'historique de vos commandes"
                    image="/src/assets/images/commandesListe.webp"
                    class="hover:text-primary transition"
                />
            </div>
        </main>
    </div>
</template>

<script lang="ts" setup>
import LinkCard from '@components/Cards/LinkCard.vue'

import { useUserStore } from '@store/user'

const user = useUserStore()
</script>

<style scoped>
h1 {
    animation: fadeInDown 1s ease-in-out;
}

@keyframes fadeInDown {
    0% {
        opacity: 0;
        transform: translateY(-20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
