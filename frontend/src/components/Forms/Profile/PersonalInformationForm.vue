<template>
    <ProfileLayout>
        <!-- Formulaire -->
      <div class="space-y-6">
        <Card class="p-6">
          <div class="flex flex-col gap-6">
              <h1 class="text-2xl font-bold uppercase">
                  Mes Informations Personnelles
              </h1>
              <form @submit.prevent="submit" class="max-w-3xl">
                  <FormGrid>
                      <!-- Firstname -->
                      <FormInput
                          name="firstName"
                          :errors="errors"
                          class="col-span-6"
                      >
                          <template #label>Prénom</template>
                          <template #input="inputProps">
                              <input
                                  v-model="form.firstName"
                                  type="text"
                                  v-bind="inputProps"
                              />
                          </template>
                      </FormInput>
                      <!-- Lastname -->
                      <FormInput
                          name="lastName"
                          :errors="errors"
                          class="col-span-6"
                      >
                          <template #label>Nom</template>
                          <template #input="inputProps">
                              <input
                                  v-model="form.lastName"
                                  type="text"
                                  v-bind="inputProps"
                              />
                          </template>
                      </FormInput>
                      <!-- Email -->
                      <FormInput
                          name="email"
                          :errors="errors"
                          class="col-span-12"
                      >
                          <template #label>Adresse e-mail</template>
                          <template #input="inputProps">
                              <input
                                  v-model="form.email"
                                  type="email"
                                  v-bind="inputProps"
                              />
                          </template>
                      </FormInput>
                      <!-- Phone -->
                      <FormInput
                          name="phone"
                          :errors="errors"
                          class="col-span-12"
                      >
                          <template #label>Téléphone</template>
                          <template #input="inputProps">
                              <input
                                  v-model="formattedPhoneNumber"
                                  :placeholder="
                                      form.phone === ''
                                          ? 'Aucun numéro de téléphone'
                                          : ''
                                  "
                                  type="tel"
                                  v-bind="inputProps"
                              />
                          </template>
                      </FormInput>
                  </FormGrid>
                  <Button class="mt-5" type="submit">Enregistrer</Button>
              </form>
          </div>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>
              Mes données personnelles
            </CardTitle>
            <CardDescription>
              Chez Apagnain vos données personnelles sont une prioritée. Vous pouvez les télécharger à tout moment.
              Pour supprimer vos informations vous pouvez supprimer votre compte.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="ghost" class="text-primary" @click="handleDownload">Télécharger mes données</Button>
            <DeleteAccount/>
          </CardContent>
        </Card>
      </div>
      </ProfileLayout>
</template>

<script setup>
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Button from '@/components/ui/button/Button.vue'
import { useToast } from '@/components/ui/toast/use-toast'
import ProfileLayout from '@/layout/ProfileLayout.vue'
import { ApiClient,apiClient } from '@/lib/apiClient'
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Card from "@components/ui/card/Card.vue";
import CardHeader from "@components/ui/card/CardHeader.vue";
import CardTitle from "@components/ui/card/CardTitle.vue";
import CardDescription from "@components/ui/card/CardDescription.vue";
import CardContent from "@components/ui/card/CardContent.vue";
import DeleteAccount from "@components/Modals/DeleteAccount.vue";

const { toast } = useToast()
const router = useRouter()

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
})

const form = reactive({
    firstName: props.user.get.firstName ?? '',
    lastName: props.user.get.lastName ?? '',
    email: props.user.get.email ?? '',
    phone: props.user.get.phone ?? '',
})

const formattedPhoneNumber = computed({
    get() {
        if (form.phone) {
            return form.phone.replace(
                /(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/,
                '$1.$2.$3.$4.$5',
            )
        }
        return ''
    },
    set(value) {
        form.phone = value.replace(/\./g, '')
    },
})

const errors = ref(null)

async function submit() {
    try {
        const data = {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
        }

        const response = await apiClient.patch(
            `/users/${props.user.get.id}`,
            data,
        )

        if (response.status === 200) {
            if (errors.value) {
                errors.value = null
            }

            toast({
                title: 'Succès',
                description:
                    'Vos informations personnelles ont été mises à jour',
                status: 'success',
            })
        }
    } catch (error) {
        handleError(error)
    }
}

function handleError(error) {
    toast({
        title: 'Erreur',
        description:
            'Erreur lors de la mise à jour de vos informations personnelles',
        status: 'error',
        variant: 'destructive',
    })
    if (error.response && error.response.data && error.response.data.errors) {
        errors.value = error.response.data.errors
    }
}

async function handleDownload() {
    let client = new ApiClient()
    try{
      await client.post(`/users/${props.user.get.id}/ask-personal-data`)
      toast({
          title: 'Succès',
          description:
              'Votre demande de téléchargement de vos données personnelles a bien été prise en compte, vous allez recevoir un email avec un lien de téléchargement',
      })
    }catch(e){
        toast({
            title: 'Erreur',
            description:
                'Erreur lors de la demande de téléchargement de vos données personnelles',
            variant: 'destructive',
        })
    }
}
</script>
