<template>

  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button class="text-red-500" variant="ghost"> Supprimer mon compte </Button>
    </AlertDialogTrigger>
    <AlertDialogContent class="max-w-[500px] w-[50vw]">
      <AlertDialogHeader>
        <AlertDialogTitle>
          <h2>Suppression de votre compte</h2>
        </AlertDialogTitle>
        <AlertDialogDescription>
          Vous êtes sur le point de supprimer votre compte. Cette action est irréversible.
          Les données de votre compte seront supprimées et vous ne pourrez plus accéder à votre compte.
          Seule les données de facturation seront conservées pour des raisons légales, chez notre préstataire Stripe.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction class="bg-red-500" @click="deleteAccount"
        >
          Confirmer la suppression
        </AlertDialogAction
        >
        <AlertDialogCancel
            class="!text-black/40"
            @click="cancel"
        >
          Je renonce
        </AlertDialogCancel>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>

</template>

<script setup>
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { ref } from 'vue'
import Button from "@components/ui/button/Button.vue";
import {apiClient} from "@/lib/apiClient.ts";
import {useUserStore} from "@/stores/user.ts";
import {useRouter} from "vue-router";
import AlertDialogTrigger from "@components/ui/alert-dialog/AlertDialogTrigger.vue";

const open = ref(true)

function cancel() {
    open.value = false
}
let router = useRouter()
function deleteAccount() {
  const user= useUserStore()
  apiClient.delete(`/users/${user.get.id}`).then(()=>{
    open.value = false
    user.logout()
    router.push("/")
  })

}
</script>
