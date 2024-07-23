<template>
    <PersonalInformationForm :user="user" />
</template>

<script setup>
import { useUserStore } from '@store/user'
import PersonalInformationForm from '@/components/Forms/Profile/PersonalInformationForm.vue'

const user = useUserStore()
</script>
