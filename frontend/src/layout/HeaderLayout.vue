<script lang="ts" setup>
import HeaderComponent from '@components/header/HeaderComponent.vue';
</script>

<template>
    <div class="mt-24">
        <HeaderComponent></HeaderComponent>
        <router-view />
    </div>
</template>