<template>
    <form @click.prevent="submit">
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
import { ref } from 'vue'
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormHeader from '@/components/Forms/FormHeader.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Separator from '@/components/ui/separator/Separator.vue'

const email = ref('')

async function submit() {
    try {
        const data = {
            email: email.value,
        }
        const response = await axios.post('/api/reset-password', {
            email: data.email,
        })
        console.log('Reset Password Successfull', response.data)
    } catch (error) {
        console.error('Reset Password failed', error)
    }
}
</script>
