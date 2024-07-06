<template>
    <Sheet>
        <SheetTrigger as-child>
            <ion-icon
                name="person-outline"
                class="text-white text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"
            ></ion-icon>
        </SheetTrigger>
        <SheetContent>
            <SheetHeader class="hidden">
                <SheetTitle>Authentification</SheetTitle>
                <SheetDescription>
                    Connecte-toi pour retrouver ta tribu de nains de jardin !
                </SheetDescription>
            </SheetHeader>
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
    </Sheet>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from '@/components/Forms/Auth/LoginForm.vue'
import RegisterForm from '@/components/Forms/Auth/RegisterForm.vue'
import ForgotPasswordForm from '@/components/Forms/Auth/ForgotPasswordForm.vue'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetDescription,
    SheetTitle,
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
