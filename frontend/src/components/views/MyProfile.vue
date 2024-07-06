<script lang="ts" setup>
import LinkCard from '@components/cards/LinkCard.vue'
import { reactive, computed } from 'vue'
</script>

<template>
    <div class="relative">
        <div class="sticky top-0 z-10">
            <img
                src="/src/assets/images/myProfileMenu.webp"
                class="w-full md:h-[60vw] lg:h-[30vw] object-cover"
            />
            <h1
                class="text-center text-xl sm:text-xl md:text-5xl w-full tracking-widest text-white uppercase absolute z-10 bottom-1/4 -y-translate-1/2 block"
            >
                Bienvenue, NOM PRENOM
            </h1>
        </div>
        <main class="bg-white w-screen relative mb-10 z-20">
            <div
                class="rotate-45 h-8 w-8 relative top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-black"
            ></div>

            <div
                class="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center p-8"
            >
                <LinkCard
                    name="Mes informations"
                    shortDescription="Modifiez vos informations personnelles"
                    image="/src/assets/images/profileMe.webp"
                ></LinkCard>

                <LinkCard
                    name="Mes commandes"
                    shortDescription="Consultez l'historique de vos commandes"
                    image="/src/assets/images/commandesListe.webp"
                ></LinkCard>
            </div>
        </main>
    </div>
</template>
