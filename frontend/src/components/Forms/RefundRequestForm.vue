<script setup lang="ts">
import FormHeader from '@components/Forms/FormHeader.vue'
import FormInput from '@components/Inputs/FormInput.vue'
import Button from '@components/ui/button/Button.vue'
import FormGrid from '@components/Forms/FormGrid.vue'
import CardDescription from '@components/ui/card/CardDescription.vue'
import Textarea from '@components/ui/textarea/Textarea.vue'
import { computed, ref } from 'vue'
import CardTitle from '@components/ui/card/CardTitle.vue'
import CardHeader from '@components/ui/card/CardHeader.vue'
import type { Order } from '@/types'
import { useToast } from '@components/ui/toast'
import { useForm } from '@/composables/useForm'

const { toast } = useToast()

const emits = defineEmits(['close'])

const props = defineProps<{
    order: Order
}>()

const reason = ref('')
const payload = computed(() => ({
    reason: reason.value,
}))

const { errors, submit } = useForm(
    `/orders/${props.order.id}/ask-for-refund`,
    payload,
)
async function handleSubmit() {
    submit(
        () => {
            toast({
                title: 'Demande de remboursement',
                description:
                    'Votre demande de remboursement a bien été prise en compte',
            })
            emits('close')
        },
        () => {
            toast({
                title: 'Erreur',
                description: 'Une erreur est survenue',
            })
        },
    )
}
</script>

<template>
    <form @submit.prevent="handleSubmit">
        <CardHeader class="p-0">
            <CardTitle>Demande de remboursement</CardTitle>
            <CardDescription class="mt-2">
                Nous sommes navrés d'apprendre que nos nains ne font pas
                l'unanimité. Merci de remplir le formulaire ci-dessous.
            </CardDescription>
        </CardHeader>
        <FormGrid>
            <div class="flex flex-col col-span-full gap-3">
                <FormInput name="reason" :errors="errors">
                    <template #label>Raison</template>
                    <template #input>
                        <textarea
                            class="w-full p-4"
                            v-model="reason"
                        ></textarea>
                    </template>
                </FormInput>

                <Button type="submit"
                    >Soumettre la demande de remboursement</Button
                >
            </div>
        </FormGrid>
    </form>
</template>

<style scoped></style>
