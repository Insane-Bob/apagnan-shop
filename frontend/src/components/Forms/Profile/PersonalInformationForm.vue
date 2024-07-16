<template>
    <!-- Formulaire -->
    <form @submit.prevent="submit" class="max-w-3xl">
        <!-- Section: Informations personnelles -->
        <FormHeader>
            <h1 class="text-md text-primary-accent font-medium">
                Informations personnelles
            </h1>
            <small class="text-xs text-gray-500">
                Ces informations sont gardées par nos nains de jardin
            </small>
        </FormHeader>
        <FormGrid>
            <!-- Firstname -->
            <FormInput :errors="errors" class="col-span-6">
                <template #label>Prénom</template>
                <template #input="inputProps">
                    <Input
                        v-model="firstName"
                        type="text"
                        :placeholder="data.user.get.firstName"
                        v-bind="inputProps"
                    />
                </template>
            </FormInput>
            <!-- Lastname -->
            <FormInput :errors="errors" class="col-span-6">
                <template #label>Nom</template>
                <template #input="inputProps">
                    <Input v-model="lastName" type="text" v-bind="inputProps" />
                </template>
            </FormInput>
            <!-- Email -->
            <FormInput :errors="errors" class="col-span-12">
                <template #label>Adresse e-mail</template>
                <template #input="inputProps">
                    <Input v-model="email" type="email" v-bind="inputProps" />
                </template>
            </FormInput>
            <!-- Phone -->
            <FormInput :errors="errors" class="col-span-12">
                <template #label>Téléphone</template>
                <template #input="inputProps">
                    <Input v-model="phone" type="tel" v-bind="inputProps" />
                </template>
            </FormInput>
            <!-- @TODO : Refacto with the PasswordInput -->
            <!-- Password -->
            <FormInput :errors="errors" class="col-span-6">
                <template #label>Mot de passe</template>
                <template #input="inputProps">
                    <input
                        v-model="password"
                        type="password"
                        v-bind="inputProps"
                    />
                </template>
            </FormInput>
            <!-- Confirm Password -->
            <FormInput :errors="errors" class="col-span-6">
                <template #label>Confirmer le mot de passe</template>
                <template #input="inputProps">
                    <input
                        v-model="passwordConfirmation"
                        type="password"
                        v-bind="inputProps"
                    />
                </template>
            </FormInput>
        </FormGrid>
        <Button class="mt-5" type="submit">Enregistrer</Button>
    </form>
</template>

<script setup>
import { ref } from 'vue'
import FormGrid from '@/components/Forms/FormGrid.vue'
import FormInput from '@/components/Inputs/FormInput.vue'
import FormHeader from '@/components/Forms/FormHeader.vue'
import Button from '@/components/ui/button/Button.vue'

const props = defineProps({
    user: {
        type: Object,
        required: true,
    },
})

console.log(props.user.get)

const errors = ref(null)
async function submit() {
    try {
        const data = {
            lastName: props.user.get.lastName ?? '',
            firstName: props.user.get.firstName ?? '',
            email: props.user.get.email ?? '',
            phone: props.user.get.phone ?? '',
            // password: password.value,
            // passwordConfirmation: passwordConfirmation.value,
        }

        // const response = await apiClient.post('/users/`$(user.id)`', data)
        console.log(data);
    } catch (error) {
        errors.value = error.response.data.errors
    }
}
</script>
