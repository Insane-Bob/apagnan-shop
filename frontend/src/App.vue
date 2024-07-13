<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
import { apiClient } from '@/lib/apiClient';
import { onMounted, ref } from 'vue';

import { useUserStore } from '@store/user'

const user = useUserStore()
const loaded = ref(false)

onMounted( async () => {

  try{
    if(localStorage.getItem('accessToken')) {
      const response = await apiClient.get('/me')

    
      if(response.status === 401){

        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        user.setUser(null)
        loaded.value = true
      
      }else{
        user.setUser(response.data.user)

        const cartResponse = await apiClient.get('/users/' + user.getId + '/basket')
        user.setCart(cartResponse.data)

        const addressesResponses = await apiClient.get('/users/' + user.getId + '/addresses')
        user.setAddresses(addressesResponses.data)
        loaded.value = true
      }
    }
  }catch(e){
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    user.setUser(null)
    loaded.value = true
  }finally{
    loaded.value = true
  }
});

</script>

<template>
  <RouterView v-if="loaded"></RouterView>
  <Toaster />
</template>

<style scoped></style>
