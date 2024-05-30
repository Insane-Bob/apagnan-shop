<template>
  <form @submit.prevent="submit">
    <FormHeader>
      <h1 class="text-md text-primary-accent font-medium">Vous êtes déjà client ?</h1>
      <small class="text-sm text-gray-500">Connectez-vous pour accéder à votre compte</small>
    </FormHeader>
    <FormGrid>
      <div class="flex flex-col col-span-full gap-4">
        <!-- EMAIL -->
        <Label for="email">Email</Label>
        <Input id="email" v-model="email" type="email" placeholder="Email" :error="emailError" />
        <!-- PASSWORD -->
        <Label for="password">Password</Label>
        <PasswordInput id="password" v-model="password" :error="passwordError" />
        <small class="text-xs text-primary-accent/60 hover:underline">Forgot your password?</small>
        <!-- SUBMIT -->
        <Button type="submit">Se connecter</Button>
      </div>
    </FormGrid>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import axios from 'axios'
import { z } from 'zod'
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormHeader from '@/components/Forms/FormHeader.vue'
import PasswordInput from '@/components/Inputs/PasswordInput.vue'
import Button from '@/components/ui/button/Button.vue'
import Label from '@/components/ui/label/Label.vue'
import Input from '@/components/ui/input/Input.vue'

// Reactive variables
const email = ref('')
const password = ref('')
const errors = ref([])

const emailError = computed(
  () => errors.value.find((error) => error.path.includes('email'))?.message
)
const passwordError = computed(
  () => errors.value.find((error) => error.path.includes('password'))?.message
)

// Zod for form validation
const loginSchema = z.object({
  email: z.string().email({ message: "Votre email n'est pas au bon format" }),
  password: z.string({ message: "Le mot de passe n'est pas valide" })
})

// Submit function
async function submit() {
  try {
    // Validating data with zod
    const result = loginSchema.safeParse({ email: email.value, password: password.value })
    if (!result.success) {
      errors.value = result.error.errors
      return
    }
    errors.value = []

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
