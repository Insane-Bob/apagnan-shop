<script lang="ts" setup>
import HeaderComponent from '@components/Header/HeaderComponent.vue'
import FooterComponent from '@components/footer/FooterComponent.vue'
</script>

<template>
    <HeaderComponent />
    <router-view />
    <FooterComponent />
</template>
