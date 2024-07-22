<template>
    <SheetContent class="overflow-auto w-full max-w-none">

        <div v-if="isLoginForm">
            <LoginForm
                @switch-to-register="switchToRegister"
                @switch-to-forgot-password="switchToForgotPassword"
            />
        </div>
        <div v-else-if="isForgotPasswordForm">
            <ForgotPasswordForm
                @switch-to-login="switchToLogin"
                @swith-to-register="switchToRegister"
            />
        </div>
        <div v-else>
            <RegisterForm @switch-to-login="switchToLogin" />
        </div>
    </SheetContent>
</template>

<script setup lang="ts">
import ForgotPasswordForm from '@/components/Forms/Auth/ForgotPasswordForm.vue'
import LoginForm from '@/components/Forms/Auth/LoginForm.vue'
import RegisterForm from '@/components/Forms/Auth/RegisterForm.vue'
import { ref } from 'vue'

import {
SheetContent,
SheetDescription,
SheetHeader,
SheetTitle
} from '@/components/ui/sheet'
const isLoginForm = ref(true)
const isForgotPasswordForm = ref(false)

const switchToLogin = () => {
    isLoginForm.value = true
    isForgotPasswordForm.value = false
}

const switchToRegister = () => {
    isLoginForm.value = false
    isForgotPasswordForm.value = false
}

const switchToForgotPassword = () => {
    isLoginForm.value = false
    isForgotPasswordForm.value = true
}
</script>
