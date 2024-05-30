<template>
  <Sheet>
    <SheetTrigger as-child>
      <ion-icon
        name="person-outline"
        class="text-white text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"
      ></ion-icon>
    </SheetTrigger>
    <SheetContent>
      <!-- Login Form -->
      <!-- <LoginForm /> -->
      <!-- Register Form -->
      <RegisterForm />
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import LoginForm from '@/components/Forms/Auth/LoginForm.vue'
import RegisterForm from '@/components/Forms/Auth/RegisterForm.vue'
import Label from '@/components/ui/label/Label.vue'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet'
</script>
