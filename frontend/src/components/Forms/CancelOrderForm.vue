<script setup lang="ts">
import Button from '@components/ui/button/Button.vue'
import FormGrid from '@components/Forms/FormGrid.vue'
import CardDescription from '@components/ui/card/CardDescription.vue'
import { computed } from 'vue'
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


const payloadRefund = computed(() => ({
  reason: "Annulation de commande avant livraison"
}))
const { submit : submitRefund } = useForm(
    `/orders/${props.order.id}/ask-for-refund`,
    payloadRefund
)

const payloadStatus = computed(() => ({ status: 'cancelled' }))
const { submit : submitUpdateStatus } = useForm(
    `/orders/${props.order.id}`,
    payloadStatus,
    "patch"
)

async function handleSubmit() {
  submitRefund(null,()=>{
    toast({
      title: 'Erreur',
      description: 'Une erreur est survenue',
    })
  })
  submitUpdateStatus(
        () => {
            toast({
                title: "Demande d'annulation",
                description:
                    'Votre demande d\'annulation a bien été prise en compte',
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
    <form @submit.prevent="handleSubmit" >
        <CardHeader class="p-0">
            <CardTitle>Annuler ma commande</CardTitle>
            <CardDescription class="mt-2">
                <p>
                  Nous sommes navrés d'apprendre que vous souhaitez annuler votre commande. Merci de remplir le formulaire ci-dessous.
                </p>
                <p class="mt-4">
                  Vous pouvez aussi demander un remboursement après avoir reçu votre commande sur un délai de 14 jours.
                  Le formulaire correspondent apparaitra sur votre page de commande une fois la commande délivrée.
                </p>
            </CardDescription>
        </CardHeader>
        <FormGrid>
            <div class="flex flex-col col-span-full gap-3">
                <Button type="submit"
                    >
                  Je confirme j'annule ma commande
                </Button>
            </div>
        </FormGrid>
    </form>
</template>

<style scoped></style>
