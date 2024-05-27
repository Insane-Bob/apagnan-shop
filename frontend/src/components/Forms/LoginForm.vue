<template>
  <form @submit.prevent="submit">
    <FormGrid>
      <div class="flex flex-col col-span-full gap-4">
        <!-- EMAIL -->
        <Label for="email">Email</Label>
        <Input id="email" v-model="email" type="email" placeholder="Email" />
        <!-- PASSWORD -->
        <Label for="password">Password</Label>
        <PasswordInput id="password" v-model="password" />
        <!-- SUBMIT -->
        <Button type="submit">Se connecter</Button>
      </div>
    </FormGrid>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { z } from 'zod'
import FormGrid from '@/components/Forms/FormGrid.vue'
import PasswordInput from '@/components/Inputs/PasswordInput.vue'
import Button from '@/components/ui/button/Button.vue'
import Label from '@/components/ui/label/Label.vue'
import Input from '@/components/ui/input/Input.vue'

// Reactive variables
const email = ref('')
const password = ref('')
const errors = ref([])

// Zod for form validation
const loginSchema = z.object({
  email: z.string().email({ message: 'Email invalide' }),
  password: z.string().min(8, { message: 'Mot de passe invalide' })
})

// Submit function
async function submit() {
  try {
    // Validating data with zod
    const result = loginSchema.safeParse({ email: email.value, password: password.value })
    if (!result.success) {
      errors.value = result.error.errors.map((err) => err.message)
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
    errors.value = [error.response.data.message]
  }
}
</script>

<style scoped>
.errors {
  color: red;
  margin-top: 1rem;
}
</style>
