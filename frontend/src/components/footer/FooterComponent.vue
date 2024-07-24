<script setup lang="ts">
import CookiesModal from '@components/Modals/CookiesModal.vue'
import { onMounted, ref } from 'vue'
import { useCookie } from '@/composables/useCookie'
import { ApiClient } from '@/lib/apiClient';
import { RouterLink } from 'vue-router';

const apiClient = new ApiClient()

const {hasBeenAsked} = useCookie()
const showCookiesModal = ref(!hasBeenAsked.value)
function openCookie(){
  showCookiesModal.value = true
}

const legalDocuments = ref<any>([])

onMounted(async () => {
  const response = await apiClient.get('/legals-documents?published=true')
  legalDocuments.value = response.data.data
})

window.openCookie = openCookie
</script>

<template>
  <CookiesModal v-model:open="showCookiesModal" />
  <footer class="bg-black w-full h-fit pb-4 md:pb-0 md:h-80 text-white flex justify-center items-center mt-20">
    <div class="flex flex-col sm:flex-row sm:gap-10 md:gap-20 pt-7">
      <div>
        <img src="../../assets/logo_white.svg" alt="Apagnain Logo" />
      </div>
      <div>
        <h3 class="mb-4 font-title text-2xl">Nous Contacter</h3>
        <ul class="flex flex-col gap-1">
          <li class="flex items-center gap-4">
            <ion-icon name="mail-outline"></ion-icon>
            <p>apagnain.contact@mail.com</p>
          </li>
          <li class="flex items-center gap-4">
            <ion-icon name="call-outline"></ion-icon>
            <p>06 06 06 06 06</p>
          </li>
        </ul>
      </div>
      <div>
        <h3 class="mb-4 font-title text-2xl">Information sur la société</h3>
        <ul class="flex flex-col gap-1">
          <li v-for="(document, index) in legalDocuments" :key="index">
            <RouterLink :to="'legal/'+document.slug" class="hover:underline cursor-pointer transition duration-300 ease-in-out">
              {{document.name}}
            </RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
