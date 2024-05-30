<template>
  <div class="relative">
    <Input
      :type="showPassword ? 'text' : 'password'"
      class="hide-password-toggle pr-10"
      placeholder="Mot de passe"
      v-bind="$attrs"
    />
    <Button
      type="button"
      variant="ghost"
      size="sm"
      class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      @click="toggleShowPassword"
    >
      <ion-icon
        :name="showPassword ? 'eye' : 'eye-off'"
        class="fixed h-4 w-4"
        aria-hidden="true"
      ></ion-icon>
      <span class="sr-only">{{ showPassword ? 'Hide password' : 'Show password' }}</span>
    </Button>
  </div>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const props = defineProps({
  value: String
})

const innerValue = ref(props.value)
const showPassword = ref(false)

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}
</script>

<style>
.hide-password-toggle::-ms-reveal,
.hide-password-toggle::-ms-clear {
  visibility: hidden;
  pointer-events: none;
  display: none;
}
</style>
