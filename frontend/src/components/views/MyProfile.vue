<template>
    <div class="relative">
        <main class="bg-white">
            <div class="flex flex-col justify-center items-center gap-2 mt-5">
                <h1>
                    Bienvenue sur votre espace personnel {{ user.user?.firstName }}
                    {{ user.user?.lastName }} !
                </h1>
                <h2 class="text-sm text-primary">
                    Vous pouvez ici
                    consulter vos informations personnelles et votre historique
                    de commandes.
                </h2>
            </div>
            <div
                class="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center p-8"
            >
                <LinkCard
                    to="/profile/informations"
                    name="Mes informations"
                    shortDescription="Modifiez vos informations personnelles"
                    image="/src/assets/images/profileMe.webp"
                />

                <LinkCard
                    to="/profile/commands"
                    name="Mes commandes"
                    shortDescription="Consultez l'historique de vos commandes"
                    image="/src/assets/images/commandesListe.webp"
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
