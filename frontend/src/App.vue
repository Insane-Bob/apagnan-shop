<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue';
import { ApiClient } from '@/lib/apiClient';
import { onMounted, ref } from 'vue';

import { useUserStore } from '@store/user';
import { useToast } from '@components/ui/toast';

const { toast } = useToast()
const user = useUserStore()
const loaded = ref(false)

const hidden = ref<boolean>(false)

onMounted( async () => {

  try{
    if(localStorage.getItem('accessToken')) {
      const apiClient = new ApiClient()
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
  }catch(e:any){
    if(e.code === "ERR_NETWORK") {
      toast({
        title: 'Erreur Backend',
        variant: 'destructive'
      })
      return
    }
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

    const apiClient = new ApiClient()

    const response = await apiClient.get('/me')
    user.setUser(response.data.user)
    user.setLoggedAs(false)

    window.location.href ='/admin/users'
}
</script>

<template>
  <RouterView v-if="loaded"></RouterView>
  <Toaster />
  <div v-if="user.isLoggedAs" class="fixed bottom-2 left-2 text-sm z-50 shadow-md">
    <div v-if="hidden" class="bg-white px-4 py-2 rounded-md text-primary w-min">
      <ion-icon @click="hidden = false" name="eye-outline" class="cursor-pointer"></ion-icon>
    </div>
    <div v-else class="bg-white px-4 py-2 rounded-md text-primary flex divide-x divide-slate-400 gap-x-2">
      <div class="flex justify-start items-center cursor-pointer  ">
        <ion-icon @click="hidden = true" name="eye-off-outline" class="text-slate-400 hover:text-red-400 duration-300"></ion-icon>
      </div>
      <div class="pl-2">
        <p class="text-sm text-primary">Connecter en tant que: <br />
          <span class="text-slate-400 italic text-xs">{{ user.identity }}</span>
        </p>
        <small @click="stopLoggedAs()" class="flex justify-start items-center gap-x-1 text-primary cursor-pointer">
          <ion-icon name="arrow-back-outline"></ion-icon>
          Se déconnecter 
        </small>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
