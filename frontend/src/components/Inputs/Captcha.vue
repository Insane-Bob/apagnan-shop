<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useCookie } from '@/composables/useCookie'

// Propriétés passées au composant
const props = defineProps<{
  errors: {
    path: string;
    message: string;
  }[]
  name: string
}>();

const uniqueId = ref('captcha-'+new Date().getTime())

// Clé de site hCaptcha
const siteKey = import.meta.env.VITE_HCAPTCHA_SITE_KEY;

const model = defineModel()
const id = defineModel("id")


const {cookiePreferences,isActive} = useCookie()
async function addScript(callback: () => void) {
  if(!isActive.value('hCaptcha')) return;
  if (document.querySelector('script[src="https://js.hcaptcha.com/1/api.js"]')) return callback()
  const script = document.createElement('script');

  script.src = "https://js.hcaptcha.com/1/api.js";
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
}
function initializeCaptcha() {
  console.log("init captcha " + uniqueId.value)
  id.value = window.hcaptcha.render(uniqueId.value, {
    sitekey: siteKey,
    callback: handleCaptchaResponse
  });
}

function handleCaptchaResponse(token: string) {
  model.value = token;
}

watch(cookiePreferences, () => {
  addScript(initializeCaptcha)
})

onMounted(()=>{
  nextTick(()=>{
    addScript(initializeCaptcha)
  })
});

const error = computed(() => {
  console.log(props.errors,props.name,props?.errors?.find(e => e.path === props.name))
  return props?.errors?.find(e => e.path === props.name);
});

function handleOpenCookie(){
  window.openCookie()
}

</script>

<template>
    <div>
      <div :id="uniqueId" v-if="isActive('hCaptcha')"></div>
      <div v-else class="text-red-400 text-xs">
        Vous devez activer les cookies hCaptcha pour vous connecter, <span class="underline cursor-pointer" @click="handleOpenCookie">gestion des cookies</span>
      </div>
      <div v-if="error" class="text-red-500 text-sm">{{ error.message }}</div>
    </div>
</template>

<style scoped>

</style>