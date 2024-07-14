<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue';
import { apiClient } from '@/lib/apiClient';
import { onMounted, ref } from 'vue';

import { useUserStore } from '@store/user';

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

        if(localStorage.getItem('oldAccessToken') && localStorage.getItem('oldRefreshToken')){
          user.setLoggedAs(true)
        }

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


const stopLoggedAs = async () => {
  const newAccessToken = localStorage.getItem('oldAccessToken') || ''
  const newRefreshToken = localStorage.getItem('oldRefreshToken') || ''

  localStorage.setItem('accessToken', newAccessToken)
  localStorage.setItem('refreshToken', newRefreshToken)

  localStorage.removeItem('oldAccessToken')
  localStorage.removeItem('oldRefreshToken')


    const response = await apiClient.get('me')
    user.setUser(response.data.user)
    user.setLoggedAs(false)

    window.location.href ='/admin/users'
}
</script>

<template>
  <RouterView v-if="loaded"></RouterView>
  <Toaster />
  <div v-if="user.isLoggedAs" class="fixed bottom-2 left-2 bg-white px-4 py-2 rounded-md ">
    <p>Connecter en tant que: <br />
      <span class="text-slate-400 italic">{{ user.identity }}</span>
    </p>
    <small @click="stopLoggedAs()" class="flex justify-start items-center gap-x-1 text-blue-400 cursor-pointer">
      <ion-icon name="arrow-back-outline"></ion-icon>
      Se déconnecter 
    </small>
  </div>
</template>

<style scoped></style>
