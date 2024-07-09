<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
import { apiClient } from '@/lib/apiClient';
import { onMounted, ref } from 'vue';

import { useUserStore } from '@store/user'

const user = useUserStore()
const loading = ref(false)

onMounted( async () => {

  if(localStorage.getItem('accessToken')) {
    const response = await apiClient.get('/me')
    user.setUser(response.data.user)
    loading.value = true
  }else{
    loading.value = true
  }
});

</script>

<template>
  <RouterView v-if="loading"></RouterView>
  <Toaster />
</template>

<style scoped></style>
