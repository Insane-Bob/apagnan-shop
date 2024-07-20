<script lang="ts" setup>
import OrderHeaderComponent from '@/components/Header/OrderHeaderComponent.vue';
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <OrderHeaderComponent />
    <router-view />
  </div>
</template>