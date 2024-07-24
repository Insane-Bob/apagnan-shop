<script setup>
import Button from '@/components/ui/button/Button.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import { ref, computed } from 'vue'
import {
    Card,
    CardTitle,
    CardContent,
    CardDescription,
} from '@/components/ui/card'
import { RouterLink } from 'vue-router'
import { useForm } from '@/composables/useForm'
import { useToast } from '../ui/toast'
import Input from '../ui/input/Input.vue'

const { toast } = useToast()
const email = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)

const payload = computed(() => ({
    email: email.value,
}))
const errors = ref({})
const { submit } = useForm('/newsletter/unsubscribe', payload, 'post')

function unsubscribed() {
    isSubmitting.value = true
    submit(
        () => {
            isSubmitting.value = false
            isSuccess.value = true
            toast({
                title: 'Succès',
                description: 'Vous avez été désinscrit avec succès.',
            })
        },
        (error) => {
            isSubmitting.value = false
            errors.value = error.response.data.errors || {}
            toast({
                title: 'Erreur',
                description: 'Vous êtes déjà désinscrit de la newsletter.',
                variant: 'destructive',
            })
        },
    )
}
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen p-4">
        <Card
            class="flex flex-col max-w-lg p-6 bg-white rounded-lg shadow-lg gap-4"
        >
            <CardTitle
                v-if="!isSuccess"
                class="text-2xl font-semibold text-gray-800"
            >
                Désinscription à la newsletter
            </CardTitle>
            <CardDescription class="text-gray-500 mb-4" v-if="!isSuccess">
                Nous sommes désolés de vous voir partir. Pour compléter votre
                désinscription, veuillez entrer votre adresse e-mail ci-dessous.
            </CardDescription>
            <CardContent class="flex flex-col items-center gap-4">
                <template v-if="!isSuccess">
                    <FormInput name="email" :errors="errors" class="w-full">
                        <template #label>Adresse e-mail</template>
                        <template #input="{ id, setRef, ...inputProps }">
                            <input
                                v-model="email"
                                type="email"
                                v-bind="inputProps"
                                class="w-full px-3 py-2"
                                :id="id"
                                ref="setRef"
                            />
                        </template>
                    </FormInput>
                    <Button
                        @click.prevent="unsubscribed()"
                        :disabled="isSubmitting"
                        variant="destructive"
                        class="w-full flex items-center justify-center gap-2"
                    >
                        <ion-spinner
                            v-if="isSubmitting"
                            class="w-4 h-4"
                            color="light"
                        ></ion-spinner>
                        <span v-if="!isSubmitting">Se désinscrire</span>
                    </Button>
                </template>
                <template v-else>
                    <div class="flex flex-col items-center gap-4">
                        <ion-icon
                            name="checkmark-circle"
                            class="text-6xl text-green-500"
                        ></ion-icon>
                        <p class="text-xl font-semibold text-gray-800">
                            Désinscription réussie
                        </p>
                        <p class="text-center text-gray-500">
                            Vous avez été désinscrit avec succès de notre
                            newsletter.
                        </p>
                    </div>
                    <RouterLink to="/" variant="ghost" class="text-primary"
                        >Retourner sur le site</RouterLink
                    >
                </template>
                <p class="text-xs text-center text-gray-500 mt-4">
                    Si vous changez d'avis, vous pouvez vous réabonner à tout
                    moment via notre
                    <RouterLink
                        to="/"
                        class="underline text-blue-500 hover:text-blue-700"
                    >
                        page d'accueil
                    </RouterLink>
                </p>
            </CardContent>
        </Card>
    </div>
</template>
