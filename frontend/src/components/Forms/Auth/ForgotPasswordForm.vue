<template>
    <form @submit.prevent="submit">
        <FormHeader>
            <h1 class="text-md text-primary-accent font-medium">
                Oh non ! Tu as égaré ton mot de passe ?
            </h1>
            <small class="text-sm text-gray-500"
                >Pas de panique ! Indique nous ton adresse e-mail pour le
                retrouver</small
            >
        </FormHeader>
        <FormGrid>
            <div class="flex flex-col col-span-full gap-4">
                <!-- EMAIL -->
                <FormInput
                    class="row-span-1 col-start-1 col-span-full"
                    required
                >
                    <template #label>Adresse e-mail</template>
                    <template #input="inputProps">
                        <Input
                            type="email"
                            v-model="email"
                            v-bind="inputProps"
                        />
                    </template>
                </FormInput>

                <!-- SUBMIT -->
                <Button @click="$emit('switch-forgot-password')" type="submit"
                    >Envoyer le mail de récupération</Button
                >
            </div>
        </FormGrid>
    </form>

    <Separator class="mt-6 mb-6" />

    <!-- Choose option -->
    <div class="flex flex-col gap-4">
        <h2 class="text-sm text-primary-accent font-medium">
            Déjà membre de la communauté ?
        </h2>
        <small class="text-sm text-gray-500">
            Connectez-vous pour retrouver tous vos amis nains et leurs aventures
            passionnantes.
        </small>
        <div class="flex justify-center w-full">
            <Button
                @click="$emit('switch-to-login')"
                variant="outline"
                class="w-full"
            >
                Se connecter
            </Button>
        </div>
    </div>
</template>

<script setup>
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormHeader from '@/components/Forms/FormHeader.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { apiClient } from '@/lib/apiClient'
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'

const email = ref('')
const { toast } = useToast()

async function submit() {
    try {
        const data = {
            email: email.value,
        }
        const response = await apiClient.post('/users/ask-reset-password', data)

        if (response) {
            toast({
                title: 'Succès',
                description:
                    'Si votre adresse e-mail est valide, vous recevrez un e-mail de réinitialisation de mot de passe',
                status: 'success',
            })
            email.value = ''
        }
    } catch (error) {
        email.value = ''
        toast({
            title: 'Erreur',
            description:
                'Une erreur est survenue lors de la réinitialisation de votre mot de passe',
            status: 'error',
            variant: 'destructive',
        })
    }
}
</script>
