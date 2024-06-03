<template>
  <form @submit.prevent="submit">
    <FormHeader>
      <h1 class="text-md text-primary-accent font-medium">Déjà l'un de nous ?</h1>
      <small class="text-sm text-gray-500"
        >Connecte-toi pour retrouver ta tribu de nains de jardin !</small
      >
    </FormHeader>
    <FormGrid>
      <div class="flex flex-col col-span-full gap-4">
        <!-- EMAIL -->
        <FormInput class="row-span-1 col-start-1 col-span-full" required>
          <template #label>Adresse e-mail</template>
          <template #input="inputProps">
            <Input type="email" v-model="email" v-bind="inputProps" />
          </template>
        </FormInput>

        <!-- PASSWORD -->
        <FormInput class="row-span-1 col-start-1 col-span-full" required>
          <template #label>Mot de passe</template>
          <template #input="inputProps">
            <input :type="passwordManager.inputType" v-model="password" v-bind="inputProps" />
          </template>
          <template #after-input>
            <ion-icon
              :name="passwordManager.isShown ? 'eye-outline' : 'eye-off-outline'"
              class="mr-2 h-4 w-4 cursor-pointer"
              @click="passwordManager.toggle()"
            ></ion-icon>
          </template>
        </FormInput>
        
        <small
          @click="$emit('switch-to-forgot-password')"
          class="text-xs text-primary-accent/60 hover:underline hover:cursor-pointer"
          >Mot de passe oublié ?</small
        >
        <!-- SUBMIT -->
        <Button type="submit">Se connecter</Button>
      </div>
    </FormGrid>
  </form>

  <Separator class="mt-6 mb-6" />

  <!-- Register -->
  <div class="flex flex-col gap-4 mt-4">
    <h2 class="text-sm text-primary-accent font-medium">Nouveau chez nous ?</h2>
    <small class="text-sm text-gray-500"
      >Rejoins notre joyeuse bande de nains de jardin et découvre un monde magiquee !</small
    >
    <div class="flex justify-center w-full">
      <Button @click="$emit('switch-to-register')" variant="outline" class="w-full"
        >Rejoins-nous !</Button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import axios from 'axios'
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormHeader from '@/components/Forms/FormHeader.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Separator from '@/components/ui/separator/Separator.vue'

// Reactive variables
const email = ref('')
const password = ref('')
const errors = ref([])

// Password Input Behavior
const passwordManager = reactive({
  isShown: ref(false),
  inputType: computed(() => {
    return passwordManager.isShown ? 'text' : 'password'
  }),
  show: () => {
    passwordManager.isShown = true
  },
  hide: () => {
    passwordManager.isShown = false
  },
  toggle: (value = passwordManager.isShown) => {
    if (value) {
      passwordManager.hide()
    } else {
      passwordManager.show()
    }
  }
})

// Submit function
// @TODO : Add custom validation with the Vadilator
async function submit() {
  try {
    const data = {
      email: email.value,
      password: password.value
    }

    const response = await axios.post('/api/auth/login', {
      email: email.value,
      password: password.value
    })
    console.log('Login successful', response.data)

    // Store tokens in local storage
    localStorage.setItem('accessToken', response.data.accessToken)
    localStorage.setItem('refreshToken', response.data.refreshToken)
  } catch (error) {
    console.error('Login failed', error)
    errors.value = [{ path: ['api'], message: error.response.data.message }]
  }
}
</script>
