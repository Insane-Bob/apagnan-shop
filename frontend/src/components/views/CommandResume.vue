<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import CardDescription from '../ui/card/CardDescription.vue'
import { apiClient } from '@/lib/apiClient'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Order } from '@/types'
import CardTitle from '@components/ui/card/CardTitle.vue'
import Separator from '@components/ui/separator/Separator.vue'
import Loader from '@components/ui/loader/Loader.vue'
import Dialog from '@components/ui/dialog/Dialog.vue'
import DialogTrigger from '@components/ui/dialog/DialogTrigger.vue'
import DialogContent from '@components/ui/dialog/DialogContent.vue'
import RefundRequestForm from '@components/Forms/RefundRequestForm.vue'
import { useCart } from '@/composables/useCart'
import { orderRoutesName } from '@/routes/order'
import CardFooter from '@components/ui/card/CardFooter.vue'
import Button from '@components/ui/button/Button.vue'

const isRefundDialogOpen = ref(false)

const options = { year: 'numeric', month: 'long', day: 'numeric' }

const route = useRoute()
const router = useRouter()

const stapes = ref<{ status: string; date: Date; description: string }[]>([])

const order = ref<Order>()
const shippingAddress = ref<string>()

const statusTranslate = {
    pending: 'En attente',
    paid: 'Payée',
    payment_failed: 'Paiement échoué',
    processing: 'En cours de préparation',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    refunded: 'Remboursée',
    cancelled: 'Annulée',
}

const statusDescription = {
    pending: 'Nous attendons la confirmation de votre paiement',
    paid: 'Votre paiement a été confirmé',
    payment_failed: 'Votre paiement a échoué',
    processing: 'Votre nain est en cours de préparation',
    shipped: 'Votre nain est en route',
    delivered: 'Votre nain est arrivé à destination',
    refunded: 'Votre nain a été remboursé',
    cancelled: 'Votre nain a été annulé',
}

const orderStatusHistoryParsed = computed(() => {
    if (!order.value) return
    return order.value?.statusHistory.map((status: object, index: number) => {
        let isLast = index === order.value.statusHistory.length - 1
        return {
            isLast: index === order.value.statusHistory.length - 1,
            color:
                status.status === 'payment_failed'
                    ? isLast
                        ? 'red-500'
                        : 'gray-400'
                    : 'primary',
            value: status.status,
            status: statusTranslate[status.status],
            date: new Date(status.createdAt),
            description: statusDescription[status.status],
        }
    })
})

async function fetch() {
    const response = await apiClient.get('/orders/' + route.params.id)
    order.value = response.data

    shippingAddress.value =
        order.value?.shipping_address.street +
        ', ' +
        order.value?.shipping_address.region +
        ', ' +
        order.value?.shipping_address.city
}
onMounted(() => {
    fetch()
})

async function reorder() {
    const { data } = await apiClient.get(`/orders/${order.value?.id}/products`)
    const products = data.data
    for (let product of products) {
        const cart = useCart(ref(product.product))
        cart.quantitySelected.value = product.quantity
        await cart.addToCart()
    }
    router.push({ name: orderRoutesName.SUMMARY })
}

async function handlePay() {
    try {
        const response = await apiClient.post(`/orders/${order.value.id}/pay`)
        window.open(response.data.url, '_blank')
    } catch (e) {
        console.error(e)
    }
}
</script>

<template>
    <loader :wait-for="order">
        <div class="px-4 sm:px-16 lg:px-24 flex flex-col gap-8 my-8">
            <div class="flex">
                <div class="">
                    <CardTitle>
                        Suivi de la commande <b>n°{{ order?.id }}</b></CardTitle
                    >
                    <CardDescription
                        >Votre commande est
                        {{ statusTranslate[order?.status] }}</CardDescription
                    >
                </div>

                <div class="flex gap-x-2 ml-auto items-center">
                    <Button
                        class="bg-primary"
                        v-if="order.status === 'shipped'"
                    >
                        Suivre ma commande
                    </Button>
                    <Dialog v-model:open="isRefundDialogOpen">
                        <DialogTrigger
                            v-if="
                                order.RefundRequestOrders.filter(
                                    (r) => !r.approved,
                                ).length === 0
                            "
                        >
                            <Button
                                class="bg-primary"
                                v-if="order.status === 'delivered'"
                            >
                                Demander un remboursement
                            </Button>
                        </DialogTrigger>
                        <div v-else class="flex flex-col w-[250px]">
                            <Button class="bg-gray-400" :disabled="true">
                                Demander un remboursement
                            </Button>
                            <small class="italic opacity-50">
                                Une demande de remboursement est en cours de
                                validation
                            </small>
                        </div>

                        <Button class="bg-primary" @click="reorder()">
                            Commander a nouveau
                        </Button>

                        <DialogContent>
                            <RefundRequestForm
                                @close="
                                    () => {
                                        isRefundDialogOpen = false
                                        fetch()
                                    }
                                "
                                :order="order"
                            ></RefundRequestForm>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div class="flex gap-6">
                <Card class="px-4 py-3">
                    <CardDescription>
                        Où votre nain doit aller
                    </CardDescription>
                    <CardTitle>{{ shippingAddress }}</CardTitle>
                </Card>
                <Card class="px-4 py-3">
                    <CardDescription> Date d'achat </CardDescription>
                    <CardTitle>
                        {{
                            new Date(
                                order?.createdAt as string,
                            ).toLocaleDateString(options) +
                            ' - ' +
                            new Date(
                                order?.createdAt as string,
                            ).toLocaleTimeString()
                        }}
                    </CardTitle>
                </Card>
                <Card class="px-4 py-3">
                    <CardDescription> Date de livraison prévue</CardDescription>
                    <CardTitle> A DEFINIR </CardTitle>
                </Card>
            </div>

            <Separator />
            <div
                class="flex flex-col-reverse lg:flex-row flex-nowrap h-full gap-x-4"
            >
                <menu class="flex-1 flex flex-col gap-y-3">
                    <Card
                        v-for="(history, index) in orderStatusHistoryParsed"
                        :key="index"
                        class="border rounded-sm w-full border-primary-accent p-0 border-l-4 shadow"
                        :class="['border-' + history.color]"
                    >
                        <CardHeader class="pb-1 py-3">
                            <CardTitle class="text-lg">{{
                                history.status
                            }}</CardTitle>
                            <CardDescription>
                                Le
                                {{
                                    history.date.toLocaleDateString(options) +
                                    ' - ' +
                                    history.date.toLocaleTimeString()
                                }}
                            </CardDescription>
                        </CardHeader>
                        <CardContent class="italic">{{
                            history.description
                        }}</CardContent>
                        <CardFooter
                            v-if="
                                history.value == 'payment_failed' &&
                                history.isLast
                            "
                            class="pb-3"
                        >
                            <button
                                @click="handlePay"
                                class="bg-red-500 text-white px-4 py-2 rounded-sm"
                            >
                                Réessayer le paiement
                            </button>
                        </CardFooter>
                    </Card>
                </menu>

                <div class="flex-shrink-0 flex-grow-0 w-[500px] rounded-sm">
                    <div
                        style="width: 100%"
                        class="rounded-sm border border-primary overflow-hidden"
                    >
                        <iframe
                            width="500"
                            height="600"
                            frameborder="0"
                            scrolling="no"
                            marginheight="0"
                            marginwidth="0"
                            src="https://maps.google.com/maps?width=720&amp;height=600&amp;hl=en&amp;q=242%20Rue%20du%20Faubourg%20Saint-Antoine,%2075012%20Paris+()&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                            ><a href="https://www.gps.ie/"
                                >gps systems</a
                            ></iframe
                        >
                    </div>
                </div>
            </div>
        </div>
    </loader>
</template>
