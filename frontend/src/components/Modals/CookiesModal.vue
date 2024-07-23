<template>
    <AlertDialog v-model:open="open">
        <AlertDialogContent class="w-[90vw] max-w-[6 00px] z-[100]">
            <AlertDialogHeader>
                <AlertDialogTitle>
                    <h2>Utilisation des Cookies sur Apagnain 🍪</h2>
                    <AlertDialogCancel
                        class="!text-xs underline"
                        @click="denyAll"
                        >
                      Continuer en acceptant les cookies nécessaires
                    </AlertDialogCancel>
                </AlertDialogTitle>
              <template v-if="!edit">
                <AlertDialogDescription>
                  Chez Apagnain, nous nous engageons à vous offrir une
                  expérience de navigation optimale et sécurisé. Pour ce
                  faire, nous utilisons des cookies et d'autres technologies
                  similaires.
                </AlertDialogDescription>
                <AlertDialogDescription>
                  Ces cookies nous permettent de :
                  <ul class="list-disc ml-6 mt-2 text-sm">
                    <li>
                      Au bon fonctionnement de notre site internet (cookie de session)
                    </li>
                    <li>
                      A la protection de notre plateforme (hCapcha)
                    </li>
                  </ul>
                </AlertDialogDescription>
                <AlertDialogDescription>
                  En continuant à naviguer sur notre site de vente de nains de
                  jardin de luxe, vous consentez à l'utilisation de ces
                  cookies. Vous avez la possibilité de gérer vos préférences
                  en matière de cookies à tout moment en accédant à notre
                  Politique de Cookies.
                </AlertDialogDescription>
              </template>
              <template v-else>
                <AlertDialogDescription>
                  <h2>Paramètres des cookies</h2>
                  <p>
                    Vous pouvez personnaliser vos préférences en matière de
                    cookies en fonction de vos besoins. Pour plus
                    d'informations, veuillez consulter notre Politique de
                    Cookies.
                  </p>
                </AlertDialogDescription>
                <div class="flex items-center gap-5">
                  <p class="text-muted-foreground text-nowrap">
                    Préférences actuelles
                  </p>
                  <Separator class="grow"/>
                </div>
                <div v-for="preference in cookiePreferences">
                  <div class="flex justify-between items-center gap-6">
                    <Switch :id="preference.name"
                            :disabled="preference?.disabled"
                            @update:checked="(e)=>{
                              setCookie(preference.name,e)
                            }"
                            :checked="preference.value"
                    />
                   <label :for="preference.name" class="block grow cursor-pointer">
                     <p>{{preference.label}}</p>
                     <p class="text-muted-foreground text-xs">{{preference.description}}</p>
                   </label>

                  </div>
                </div>

              </template>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <Button @click="handleOk">
                  {{!edit ? 'Accepter tous les cookies' : 'Enregistrer'}}
                </Button>
                <Button
                  variant="ghost"
                    class="!text-black/40"
                    @click="openCookieSettings"
                    >
                    {{!edit ? 'Paramètres des cookies' : 'Fermer'}}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>

<script setup lang="ts">
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { ref } from 'vue'
import { useCookie } from '@/composables/useCookie.ts'
import { Button } from '@components/ui/button'
import {Switch} from "@components/ui/switch";
import {Separator} from "@components/ui/separator";

const open = defineModel('open')
const edit = ref(false)

const {cookiePreferences,setCookie, disableAll, activeAll,setCookieHasBeenAsked} = useCookie()


function handleOk(){
  if(edit.value){
    closeModal()
  }else{
    activeAll()
    closeModal()
  }
}
function denyAll(){
  disableAll()
  closeModal()
}
const closeModal = () => {
  setCookieHasBeenAsked()
  open.value = false
}
const openCookieSettings = () => {
  edit.value = !edit.value
}
</script>
