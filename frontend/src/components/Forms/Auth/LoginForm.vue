<template>
    <form @submit.prevent="submit">
        <FormHeader>
            <h1 class="text-md text-primary-accent font-medium">
                Déjà l'un de nous ?
            </h1>
            <small class="text-sm text-gray-500">
                Connecte-toi pour retrouver ta tribu de nains de jardin !
            </small>
        </FormHeader>
        <FormGrid>
            <div class="flex flex-col col-span-full gap-3">
                <!-- EMAIL -->
                <FormInput
                    name="email"
                    :errors="errors"
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

                <!-- PASSWORD -->
                <FormInput
                    name="password"
                    :errors="errors"
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

                <small
                    @click="$emit('switch-to-forgot-password')"
                    class="text-xs text-primary-accent/60 hover:underline hover:cursor-pointer"
                >
                    Mot de passe oublié ?
                </small>
                <!-- SUBMIT -->
                <Button type="submit">Se connecter</Button>
            </div>
        </FormGrid>
    </form>

    <Separator class="mt-4 mb-4" />

    <!-- Register -->
    <div class="flex flex-col gap-4 mt-4">
        <h2 class="text-sm text-primary-accent font-medium">
            Nouveau chez nous ?
        </h2>
        <small class="text-sm text-gray-500">
            Rejoins notre joyeuse bande de nains de jardin et découvre un monde
            magique !
        </small>
        <div class="flex justify-center w-full">
            <Button
                @click="$emit('switch-to-register')"
                variant="outline"
                class="w-full"
            >
                S'inscrire
            </Button>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormHeader from '@/components/Forms/FormHeader.vue'
import Button from '@/components/ui/button/Button.vue'
import Input from '@/components/ui/input/Input.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import { apiClient } from '@/lib/apiClient'
import { useRouter } from 'vue-router'
import { useToast } from '@/components/ui/toast/use-toast'
import { useUserStore } from '@store/user'

const user = useUserStore()

// Reactive variables
const email = ref('')
const password = ref('')
const errors = ref(null)

// Password Input Behavior
const passwordManager = reactive({
    isShown: false,
    inputType: computed(() => (passwordManager.isShown ? 'text' : 'password')),
    toggle() {
        this.isShown = !this.isShown
    },
})

const router = useRouter()
const { toast } = useToast()

// Submit function
async function submit() {
    try {
        const data = { email: email.value, password: password.value }
        const response = await apiClient.post('/login', data)

        const userData = response.data.user

        // Store tokens in local storage
        localStorage.setItem('accessToken', response.data.accessToken)
        localStorage.setItem('refreshToken', response.data.refreshToken)

        user.setUser(userData)

        toast({
            title: 'Succès',
            description:
                'Connexion réussie, bienvenue dans votre espace personnel !',
            status: 'success',
        })

        // Redirect to profile page
        router.push('/profile')
    } catch (error) {
        handleError(error)
    }
}

function handleError(error) {
    toast({
        title: 'Erreur',
        description: 'La connexion a échoué, veuillez réessayer.',
        status: 'error',
    })
    if (error.response && error.response.data && error.response.data.errors) {
        errors.value = error.response.data.errors
    }
}
</script>
