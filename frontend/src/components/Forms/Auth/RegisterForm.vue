<template>
    <form v-if="!isSubmitted" @submit.prevent="submit">
        <FormHeader>
            <h1 class="text-md text-primary-accent font-medium">
                Rejoignez notre communauté !
            </h1>
            <small class="text-sm text-gray-500">
                Inscrivez-vous pour accéder à votre compte et découvrir un monde
                miniature rempli de surprises.
            </small>
        </FormHeader>
        <FormGrid>
            <div class="flex flex-col col-span-full gap-3">
                <!-- LASTNAME & FIRSTNAME -->
                <div class="grid grid-cols-2 gap-4">
                    <!-- LASTNAME -->
                    <FormInput
                        name="lastName"
                        :errors="errors"
                        class="col-span-1"
                        required
                    >
                        <template #label>Nom</template>
                        <template #input="inputProps">
                            <Input
                                type="text"
                                v-model="lastName"
                                v-bind="inputProps"
                            />
                        </template>
                    </FormInput>

                    <!-- FIRSTNAME -->
                    <FormInput
                        name="firstName"
                        :errors="errors"
                        class="col-span-1"
                        required
                    >
                        <template #label>Prénom</template>
                        <template #input="inputProps">
                            <Input
                                type="text"
                                v-model="firstName"
                                v-bind="inputProps"
                                :id="inputProps.id"
                            />
                        </template>
                    </FormInput>
                </div>

                <!-- EMAIL -->
                <FormInput
                    name="email"
                    :errors="errors"
                    class="row-span-1 col-start-1 col-span-full"
                    required
                >
                    <template #label>Adresse mail</template>
                    <template #input="inputProps">
                        <input
                            type="email"
                            v-model="email"
                            v-bind="inputProps"
                        />
                    </template>
                </FormInput>

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
                            rule.isValid ? 'text-green-600' : 'text-red-600'
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
                    name="passwordConfirmation"
                    v-model="passwordConfirmation"
                    :errors="errors"
                    required
                >
                    <template #label>Confirmer le mot de passe</template>
                </PasswordInput>

                <div class="flex flex-col gap-6 py-3">
                  <FormInput :errors="errors" name="approveCGV_CGU" inputClass="bg-red-50" variant="none">
                    <div class="flex gap-2 items-center">
                      <Checkbox
                          @update:checked="
                          (checked) => approveCGV_CGU = checked
                        "
                      ></Checkbox>
                      <Label>
                        Accepter les <RouterLink to="/cgu" class="text-primary underline">conditions générales de vente et d'utilisations</RouterLink>
                      </Label>
                    </div>
                  </FormInput>

                  <Captcha name="captcha" :errors="errors" v-model="captcha" v-model:id="captchaId"/>
                </div>

                <Button :disabled="!isFormValid || isSubmitting">
                    <ion-spinner
                        v-if="isSubmitting"
                        class="w-4 h-4"
                        color="light"
                    ></ion-spinner>
                    <span v-if="isSubmitting" class="ml-2"
                        >Inscription en cours</span
                    >
                    <span v-else>S'inscrire</span>
                </Button>

                <FormPrivacy></FormPrivacy>
            </div>
        </FormGrid>

        <!-- Separator -->
        <Separator class="mt-4 mb-4" />

        <!-- Login -->
        <div class="flex flex-col gap-4">
            <h2 class="text-sm text-primary-accent font-medium">
                Déjà membre de la communauté ?
            </h2>
            <small class="text-sm text-gray-500">
                Connectez-vous pour retrouver tous vos amis nains et leurs
                aventures passionnantes.
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
    </form>

    <div v-else>
        <div class="flex flex-col gap-4">
            <h1 class="text-md text-primary-accent font-medium">
                Inscription réussie !
            </h1>
            <small class="text-sm text-gray-500">
                Un mail afin d'activer votre compte vous a été envoyé.
            </small>
            <form @submit.prevent="resendEmail" class="flex flex-col gap-3">
                <FormInput
                    name="email"
                    :errors="errors"
                    class="row-span-1 col-start-1 col-span-full"
                    required
                >
                    <template #label>Adresse mail</template>
                    <template #input="inputProps">
                        <input
                            type="email"
                            v-model="email"
                            v-bind="inputProps"
                        />
                    </template>
                </FormInput>
                <Button type="submit">Renvoyer le mail</Button>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import FormGrid from '@/components/Forms/FormGrid.vue'
import PasswordInput from '@/components/Inputs/PasswordInput.vue'
import FormHeader from '@/components/Forms/FormHeader.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { ApiClient } from '@/lib/apiClient.js'
import { computed, reactive, ref } from 'vue'
import Captcha from '@components/Inputs/Captcha.vue'
import { Checkbox } from '@components/ui/checkbox'
import { Label } from '@components/ui/label'
import FormPrivacy from '@components/Forms/FormPrivacy.vue'

const apiClient = new ApiClient()

// Reactive variables
const lastName = ref('')
const firstName = ref('')
const email = ref('')
const password = ref('')
const passwordConfirmation = ref('')
const approveCGV_CGU = ref(false)
const captcha = ref('')
const captchaId = ref('')

const errors = ref(null)
const isSubmitted = ref(false)
const isSubmitting = ref(false)

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
        isValid: /[!@#$%^&*(),.?":{}|<>]/.test(password.value),
    },
])

// Computed property to check if the form is valid
const isFormValid = computed(() => {
    return (
        lastName.value &&
        firstName.value &&
        email.value &&
        password.value &&
        passwordConfirmation.value &&
        password.value === passwordConfirmation.value &&
        passwordRules.value.every((rule) => rule.isValid)
    )
})

// Submit function
async function submit() {
    try {
        errors.value = null
        isSubmitting.value = true
        const data = {
            lastName: lastName.value,
            firstName: firstName.value,
            email: email.value,
            password: password.value,
            passwordConfirmation: passwordConfirmation.value,
            captcha : captcha.value,
            approveCGV_CGU : approveCGV_CGU.value
        }
        await apiClient.post('/register', data)

        setTimeout(() => {
            isSubmitted.value = true
            isSubmitting.value = false
        }, 2000)
    } catch (error) {
        window.hcaptcha.reset(captchaId.value)
        console.error('Registration failed', error)
        errors.value = error.response.data.errors
        isSubmitting.value = false
    }
}

async function resendEmail() {
    try {
        const data = {
            email: email.value,
        }
        const response = await apiClient.post('/resend-activation-email', data)
        console.log('Email resent', response)
    } catch (error) {
        console.error('Email resend failed', error)
        errors.value = error.response.data.errors
    }
}
</script>
