<template>
    <form @submit.prevent="submit">
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
                <div class="grid grid-cols-2 gap-4">
                    <!-- LASTNAME -->
                    <FormInput class="col-span-1" required>
                        <template #label>Nom</template>
                        <template #input="inputProps">
                            <Input
                                type="text"
                                v-model="lastname"
                                v-bind="inputProps"
                            />
                        </template>
                    </FormInput>

                    <!-- FIRSTNAME -->
                    <FormInput class="col-span-1" required>
                        <template #label>Prénom</template>
                        <template #input="inputProps">
                            <Input
                                type="text"
                                v-model="firstname"
                                v-bind="inputProps"
                                :id="inputProps.id"
                            />
                        </template>
                    </FormInput>
                </div>

                <!-- EMAIL -->
                <FormInput
                    class="row-span-1 col-start-1 col-span-full"
                    required
                >
                    <template #label>Adresse mail</template>
                    <template #input="inputProps">
                        <Input
                            type="email"
                            v-model="email"
                            v-bind="inputProps"
                        />
                    </template>
                </FormInput>

                <!-- PASSWORD -->
                <FormInput
                    class="row-span-1 col-start-1 col-span-full"
                    required
                >
                    <template #label>Mot de passe</template>
                    <template #input="inputProps">
                        <input
                            :type="passwordManager.inputType"
                            v-model="password"
                            v-bind="inputProps"
                        />
                    </template>
                    <template #after-input>
                        <div class="flex items-center">
                            <ion-icon
                                :name="
                                    passwordManager.isShown
                                        ? 'eye-outline'
                                        : 'eye-off-outline'
                                "
                                class="mr-2 h-4 w-4 cursor-pointer"
                                @click="passwordManager.toggle()"
                            ></ion-icon>
                        </div>
                    </template>
                </FormInput>

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
                <FormInput
                    class="row-span-1 col-start-1 col-span-full"
                    required
                >
                    <template #label>Confirmation du mot de passe</template>
                    <template #input="inputProps">
                        <input
                            :type="passwordManager.inputType"
                            v-model="confirmPassword"
                            v-bind="inputProps"
                        />
                    </template>
                    <template #after-input>
                        <ion-icon
                            :name="
                                passwordManager.isShown
                                    ? 'eye-outline'
                                    : 'eye-off-outline'
                            "
                            class="mr-2 h-4 w-4 cursor-pointer"
                            @click="passwordManager.toggle()"
                        ></ion-icon>
                    </template>
                </FormInput>

                <!-- SUBMIT -->
                <Button type="submit">Rejoindre la communauté</Button>
            </div>
        </FormGrid>
    </form>

    <Separator class="mt-6 mb-6" />

    <!-- Login -->
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

<script setup lang="ts">
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormHeader from '@/components/Forms/FormHeader.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { apiClient } from '@/lib/apiClient.js'
import { computed, reactive, ref } from 'vue'

// Reactive variables
const lastname = ref('')
const firstname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// Password validation logic
const passwordRules = computed(() => [
    {
        message: 'Minimum 8 caractères',
        isValid: password.value.length >= 8,
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

// Password manager for showing/hiding password
const passwordManager = reactive({
    inputType: 'password',
    isShown: false,
    toggle() {
        this.isShown = !this.isShown
        this.inputType = this.isShown ? 'text' : 'password'
    },
})

// Submit function

async function submit() {
    try {
        const data = {
            lastname: lastname.value,
            firstname: firstname.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value,
        }

        const response = await apiClient.post('/register', {
            lastname: data.lastname,
            firstname: data.firstname,
            email: data.email,
            password: data.password,
        })
        console.log('Registration successful', response.data)
    } catch (error) {
        console.error('Registration failed', error)
    }
}
</script>
