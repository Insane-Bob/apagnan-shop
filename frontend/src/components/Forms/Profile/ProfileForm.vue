<template>
    <main class="bg-white w-screen relative mb-10 z-20 p-12">
        <!-- TITLE -->
        <div class="flex flex-col items-center gap-3 mb-5">
            <h1 class="text-md text-primary-accent font-medium">
                Bienvenue chez toi
                {{ user.get.firstName + ' ' + user.get.lastName }} !
            </h1>
            <small class="text-xs text-gray-500"
                >Dans cette partie du royaume, vous trouverez toutes vos
                informations personnelles.
                <hr class="mt-5"/>
            </small>
        </div>
        <!-- PERSONAL INFORMATION -->
        <PersonalInformationForm :user="user" />
    </main>
</template>

<script setup>
import { useUserStore } from '@store/user'
import PersonalInformationForm from '@/components/Forms/Profile/PersonalInformationForm.vue'

const user = useUserStore()
</script>
