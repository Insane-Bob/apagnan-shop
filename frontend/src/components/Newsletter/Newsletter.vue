<script setup lang="ts">
import Input from '@components/ui/input/Input.vue'
import FormInput from '@components/Inputs/FormInput.vue'
import { computed, ref } from 'vue'
import OutlinedInput from '@components/ui/input/OutlinedInput.vue'
import Button from '@components/ui/button/Button.vue'
import { useForm } from '@/composables/useForm'
import { useToast, toast } from '../ui/toast'
import { useUserStore } from '@/stores/user'

const { toast } = useToast()
const email = ref('')

const payload = computed(() => {
    return {
        email: email.value,
    }
})

const { submit, errors } = useForm('/newsletter/subscribe', payload)

async function handleSubmit() {
    try {
        await submit()
        email.value = null
        toast({
            title: 'Succès',
            description:
                'Vous êtes maintenant abonné à notre newsletter, vous recevrez un e-mail de confirmation.',
            duration: 2000,
        })
    } catch (error) {
        toast({
            title: 'Erreur',
            description: 'Vous êtes déjà inscrit à la newsletter',
            variant: 'destructive',
            duration: 2000,
        })
    }
}
</script>

<template>
    <div class="border-0 shadow-lg bg-primary/5 rounded overflow-hidden">
        <div class="grid grid-cols-3 items-center">
            <div
                class="col-span-3 md:col-span-1 max-h-[250px] md:max-h-[300px] overflow-hidden"
            >
                <img
                    src="/images/newsletter.png"
                    alt="newsletter"
                    class="w-full h-full object-cover object-top"
                />
            </div>
            <div class="col-span-3 md:col-span-2 p-6">
                <h1 class="text-2xl font-bold text-gray-800">
                    S'abonner à notre Newsletter.
                </h1>
                <p class="text-gray-600 mt-2">
                    S'abonner à notre newsletter, afin d'être au courant des
                    dernier produits, et remise en stock.
                </p>
                <form class="mt-4" @submit.prevent="handleSubmit()">
                    <FormInput
                        :errors="errors"
                        v-model="email"
                        name="email"
                        class="w-full"
                    >
                        <template #label>Adresse e-mail</template>
                        <template #input="inputProps">
                            <div></div>
                            <Input
                                placeholder="Entrer votre adresse e-mail"
                                type="email"
                                v-model="email"
                                v-bind="inputProps"
                            />
                        </template>
                    </FormInput>
                    <Button class="flex items-center gap-3 mt-3 uppercase">
                        <ion-icon name="send" class="-rotate-45"></ion-icon>
                        <span>S'abonner</span>
                    </Button>
                </form>
            </div>
        </div>
    </div>
</template>
