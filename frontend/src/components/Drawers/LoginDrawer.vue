<template>
  <Sheet>
    <SheetTrigger as-child>
      <ion-icon
        name="person-outline"
        class="text-white text-2xl cursor-pointer hover:scale-105 duration-100 hidden md:block"
      ></ion-icon>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader class="gap-y-6">
        <SheetTitle class="">Vous êtes déjà client ?</SheetTitle>
        <SheetDescription> Accéder à votre espace et continuer votre shopping </SheetDescription>
      </SheetHeader>
      <!-- Login Form -->
      <LoginForm class="mt-6" />
      <SheetFooter>
        <SheetClose as-child> </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>

<script setup>
import Button from '@/components/ui/button/Button.vue'
import LoginForm from '@/components/Forms/LoginForm.vue'
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
