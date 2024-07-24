<template>
    <div class="flex flex-col justify-center items-center gap-3">
        <Card v-if="!isSubmitted">
            <CardHeader class="text-center">
                <FormHeader
                    class="flex flex-col justify-center items-center gap-3"
                >
                    <img
                        src="/src/assets/images/dwarfs/dwarf_sad.png"
                        alt="Logo"
                        class="h-32 w-52"
                    />
                    <h1 class="text-md text-primary-accent font-medium">
                        Oups, un de nos nains a égaré votre mot de passe ! 😲
                    </h1>
                    <small class="text-sm text-gray-500">
                        Pas de panique, nous allons vous envoyer un lien pour
                        réinitialiser votre mot de passe
                    </small>
                </FormHeader>
            </CardHeader>
            <CardContent>
                <form @submit.prevent="updatePassword">
                    <FormGrid>
                        <div
                            class="flex flex-col justify-center col-span-full gap-3"
                        >
                            <!-- PASSWORD -->
                            <PasswordInput
                                name="password"
                                v-model="password"
                                :errors="errors"
                                required
                            >
                                <template #label>Mot de passe</template>
                            </PasswordInput>
                            <!-- PASSWORD VALIDATION -->
                            <div class="flex flex-wrap">
                                <small
                                    v-for="rule in passwordRules"
                                    :key="rule.message"
                                    :class="
                                        rule.isValid
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                    "
                                    class="text-xs w-1/2 flex items-center transition-all duration-300 ease-in-out"
                                >
                                    <ion-icon
                                        :name="
                                            rule.isValid
                                                ? 'checkmark-outline'
                                                : 'close-outline'
                                        "
                                        class="mr-1"
                                    ></ion-icon>
                                    {{ rule.message }}
                                </small>
                            </div>

                            <!-- CONFIRM PASSWORD -->
                            <PasswordInput
                                name="confirmPassword"
                                v-model="confirmPassword"
                                :errors="errors"
                                required
                            >
                                <template #label
                                    >Confirmer le mot de passe</template
                                >
                            </PasswordInput>
                        </div>
                    </FormGrid>
                    <!-- SUBMIT -->
                    <div class="flex justify-center mt-5">
                        <Button type="submit"
                            >Réinitialiser mon mot de passe</Button
                        >
                    </div>
                </form>
            </CardContent>
        </Card>
        <Card v-else>
            <CardContent>
                <div
                    class="flex flex-col items-center justify-center text-center gap-3 p-4"
                >
                    <img
                        src="/src/assets/images/dwarfs/dwarf-happy.png"
                        class="h-32 w-32"
                    />
                    <h1 class="text-md text-primary-accent font-medium">
                        Votre mot de passe a été réinitialisé avec succès ! 🎉
                    </h1>
                    <small class="text-sm text-gray-500">
                        Vous pouvez maintenant vous connecter avec votre nouveau
                        mot de passe.
                    </small>
                    <RouterLink to="/">
                        <Button class="mt-5">Se connecter</Button>
                    </RouterLink>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup>
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormHeader from '@/components/Forms/FormHeader.vue'
import PasswordInput from '@/components/Inputs/PasswordInput.vue'
import Button from '@/components/ui/button/Button.vue'
import { ApiClient } from '@/lib/apiClient'
import { computed, ref } from 'vue'
import { useForm } from '@/composables/useForm'
import { RouterLink, useRoute } from 'vue-router'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

const apiClient = new ApiClient()

const route = useRoute()

const password = ref('')
const confirmPassword = ref('')
const errors = ref(null)
const isSubmitted = ref(false)

const userId = route.query.user_id
const identifier = route.query.a

// Password validation logic
const passwordRules = computed(() => [
    {
        message: 'Minimum 12 caractères',
        isValid: password.value.length >= 12,
    },
    {
        message: 'Une lettre majuscule',
        isValid: /[A-Z]/.test(password.value),
    },
    {
        message: 'Un chiffre',
        isValid: /\d/.test(password.value),
    },
    {
        message: 'Un caractère spécial',
        isValid: /[!@#$%^&*(),.?":{}|<script>]/.test(password.value),
    },
])

const payload = {
    identifier: identifier,
    password: password.value,
    confirmPassword: confirmPassword.value,
}

const { submit } = useForm(
    '/users/' +
        encodeURIComponent(userId) +
        '?a=' +
        encodeURIComponent(identifier),
    payload,
    'patch',
)

function updatePassword() {
    submit(
        () => {
            isSubmitted.value = true
        },
        (error) => {
            errors.value = error.response.data.message
        },
    )
}
</script>
