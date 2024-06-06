<script lang="ts" setup>
import HeaderComponent from '@components/header/HeaderComponent.vue';
import FooterComponent from '@components/footer/FooterComponent.vue';
</script>

<template>
    <HeaderComponent></HeaderComponent>
    <router-view />
    <FooterComponent></FooterComponent>
</template>