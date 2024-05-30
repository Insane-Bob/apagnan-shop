<template>
  <form @submit.prevent="submit">
    <FormHeader>
      <h1 class="text-md text-primary-accent font-medium">Vous n'êtes pas encore client ?</h1>
      <small class="text-sm text-gray-500"> Inscrivez-vous pour accéder à votre compte </small>
    </FormHeader>
    <FormGrid>
      <div class="flex flex-col col-span-full gap-4">
        <div class="grid grid-cols-2 gap-4">
          <!-- LASTNAME -->
          <div class="flex flex-col">
            <Label for="lastname">Nom</Label>
            <Input
              id="lastname"
              v-model="lastname"
              type="text"
              placeholder="Nom"
              :error="lastnameError"
            />
          </div>

          <!-- FIRSTNAME -->
          <div class="flex flex-col">
            <Label for="firstname">Prénom</Label>
            <Input
              id="firstname"
              v-model="firstname"
              type="text"
              placeholder="Prénom"
              :error="firstnameError"
            />
          </div>
        </div>

        <!-- EMAIL -->
        <Label for="email">Email</Label>
        <Input id="email" v-model="email" type="email" placeholder="Email" :error="emailError" />

        <!-- PASSWORD -->
        <Label for="password">Password</Label>
        <PasswordInput id="password" v-model="password" :error="passwordError" />

        <!-- CONFIRM PASSWORD -->
        <Label for="confirmPassword">Confirm Password</Label>
        <PasswordInput
          id="confirmPassword"
          v-model="confirmPassword"
          :error="confirmPasswordError"
        />
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
import FormHeader from '@/components/Forms/FormHeader.vue'
import FormGrid from '@/components/Forms/FormGrid.vue'
import PasswordInput from '@/components/Inputs/PasswordInput.vue'
import Button from '@/components/ui/button/Button.vue'
import Label from '@/components/ui/label/Label.vue'
import Input from '@/components/ui/input/Input.vue'

// Reactive variables
const lastname = ref('')
const firstname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errors = ref([])

// Computed properties for individual field errors
const lastnameError = computed(
  () => errors.value.find((error) => error.path.includes('lastname'))?.message
)
const firstnameError = computed(
  () => errors.value.find((error) => error.path.includes('firstname'))?.message
)
const emailError = computed(
  () => errors.value.find((error) => error.path.includes('email'))?.message
)
const passwordError = computed(
  () => errors.value.find((error) => error.path.includes('password'))?.message
)
const confirmPasswordError = computed(
  () => errors.value.find((error) => error.path.includes('confirmPassword'))?.message
)

// Functions to filter errors for each field
const lastnameErrors = computed(() =>
  errors.value.filter((error) => error.path.includes('lastname')).map((error) => error.message)
)
const firstnameErrors = computed(() =>
  errors.value.filter((error) => error.path.includes('firstname')).map((error) => error.message)
)
const emailErrors = computed(() =>
  errors.value.filter((error) => error.path.includes('email')).map((error) => error.message)
)
const passwordErrors = computed(() =>
  errors.value.filter((error) => error.path.includes('password')).map((error) => error.message)
)
const confirmPasswordErrors = computed(() =>
  errors.value
    .filter((error) => error.path.includes('confirmPassword'))
    .map((error) => error.message)
)

// Zod for form validation
const registerSchema = z
  .object({
    lastname: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
    firstname: z.string().min(2, { message: 'Le prénom doit contenir au moins 2 caractères' }),
    email: z.string().email({ message: 'Email invalide' }),
    password: z
      .string()
      .min(8, { message: 'Le mot de passe doit contenir 8 charactères min' })
      .regex(/[a-z]/, {
        message: 'Le mot de passe doit contenir au moins une lettre minuscule'
      })
      .regex(/[A-Z]/, {
        message: 'Le mot de passe doit contenir au moins une lettre majuscule'
      })
      .regex(/[0-9]/, { message: 'Le mot de passe doit contenir au moins 1 chiffre' }),
    confirmPassword: z.string().refine((data) => data === password.value, {
      message: 'Les mots de passe ne correspondent pas',
      path: ['confirmPassword']
    })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword']
  })

// Submit function
async function submit() {
  try {
    // Validating data with zod
    const result = registerSchema.safeParse({
      lastname: lastname.value,
      firstname: firstname.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    })
    if (!result.success) {
      errors.value = result.error.errors
      return
    }
    errors.value = []

    const response = await axios.post('/api/auth/register', {
      lastname: lastname.value,
      firstname: firstname.value,
      email: email.value,
      password: password.value
    })
    console.log('Registration successful', response.data)

    // Redirect or update application state
  } catch (error) {
    console.error('Registration failed', error)
    errors.value = [{ path: ['api'], message: error.response.data.message }]
  }
}
</script>
