<script lang="ts" setup>
import HeaderComponent from '../header/HeaderComponent.vue';
import LinkCard from '../cards/LinkCard.vue';
</script>

<template>
    <div class="relative">
        <HeaderComponent></HeaderComponent>
            <div class="sticky top-0 z-10">
                <img src="https://media.istockphoto.com/id/114452225/fr/photo/nain-sur-de-lherbe.jpg?s=612x612&w=0&k=20&c=uI1IjnrfEO4coxDAQALD7BLIC_EAZ88LoMtyq_8m7IM=" 
                class="w-full md:h-[60vw] lg:h-[30vw] object-cover "
                >
                <h1 class="text-center text-xl sm:text-xl md:text-5xl w-full tracking-widest text-white uppercase absolute z-10 bottom-1/4 -y-translate-1/2 block">Bienvenue, NOM PRENOM</h1>
                
            </div>
        <main class="bg-white w-screen relative h-screen z-20">
            <div class="rotate-45 h-8 w-8 relative top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 bg-black"></div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center mt-24">
            
                <LinkCard name="Mes informations" shortDescription="Modifiez vos informations personnelles" image="/src/assets/images/green-gnome.png"></LinkCard>

                <LinkCard name="Mes commandes" shortDescription="Consultez l'historique de vos commandes" image="/src/assets/images/green-gnome.png"></LinkCard>
            </div>
        </main>
    </div>
</template>