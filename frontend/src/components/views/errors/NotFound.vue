<script setup lang="ts">
import HeaderComponent from '@components/header/HeaderComponent.vue';
import Button from '@components/ui/button/Button.vue';
</script>

<template>
    <HeaderComponent></HeaderComponent >
        <div class="relative">
            <div class="sticky top-0 z-10 bg-black">
                <img src="/src/assets/images/notFound.webp" 
                class="w-full h-[110vw] sm:h-[50vw] md:h-[60vw] lg:h-[40vw] object-top object-cover"
                >
                
            </div>
        <main class="bg-white relative h-screen z-20">
        
            <div class="text-center  flex flex-col items-center justify-center  gap-y-3 md:gap-y-5 pt-8">
                <div class="flex w-full px-12 items-center gap-x-4">
                    <hr class="w-4/5 border-t-2 sm:border-t-4 border-primary"/>
                    <h1 class="text-7xl sm:text-9xl">404</h1>
                    <hr class="w-4/5 border-t-2 sm:border-t-4 border-primary"/>
                </div>
                <h2 class="text-2xl">Page non trouvée</h2>
                <RouterLink to="/" ><Button> Revenir en lieu sûr</Button></RouterLink>
            </div>

        </main>
    </div>

    {# Ajouter le FOOTER #}
</template>