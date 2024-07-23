<script setup lang="ts">
import CookiesModal from '@components/Modals/CookiesModal.vue'
import { ref } from 'vue'
import { useCookie } from '@/composables/useCookie'

const {hasBeenAsked} = useCookie()
const showCookiesModal = ref(!hasBeenAsked.value)
function openCookie(){
  showCookiesModal.value = true
}

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
          <li>
            <a href="#" class="hover:underline cursor-pointer transition duration-300 ease-in-out"
              >A propos de Apagnain</a
            >
          </li>
          <li>
            <a href="#" class="hover:underline cursor-pointer transition duration-300 ease-in-out"
              >Code éthique</a
            >
          </li>
          <li>
            <a href="#" class="hover:underline cursor-pointer transition duration-300 ease-in-out"
              >Juridique</a
            >
          </li>
          <li>
            <a href="#" class="hover:underline cursor-pointer transition duration-300 ease-in-out"
              >Politique de confidentialité</a
            >
          </li>
          <li @click="openCookie" class="hover:underline cursor-pointer">
             Gestions des cookies
          </li>
          <li>
            <a href="#" class="hover:underline cursor-pointer transition duration-300 ease-in-out"
              >Information sur la société</a
            >
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>
