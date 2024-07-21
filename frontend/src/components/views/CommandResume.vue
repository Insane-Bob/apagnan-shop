<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import CardDescription from '../ui/card/CardDescription.vue'
import { ApiClient } from '@/lib/apiClient'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Order } from '@/types'
import CardTitle from '@components/ui/card/CardTitle.vue'
import Separator from '@components/ui/separator/Separator.vue'
import Loader from '@components/ui/loader/Loader.vue'
import CardFooter from '@components/ui/card/CardFooter.vue'
import Button from '@components/ui/button/Button.vue'
import ProfileLayout from '@/layout/ProfileLayout.vue'
import Badge from '@components/ui/badge/Badge.vue'
import OrderDetailsProductList from '@components/product/OrderDetailsProductList.vue'
import { usePaymentBroadcastChannel } from '@/composables/usePaymentBroadcastChannel'
import { useUserStore } from '@/stores/user'
import CommandManageMenu from '@components/Menus/CommandManageMenu.vue'
import DocumentsList from '@components/views/order/DocumentsList.vue'

const apiClient = new ApiClient()

const isRefundDialogOpen = ref(false)

const options = { year: 'numeric', month: 'long', day: 'numeric' }

const user = useUserStore()
const route = useRoute()
usePaymentBroadcastChannel(() => {
    fetch()
})

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
    const response = await apiClient.get(
        '/orders/' + route.params.id + '?withProducts',
    )
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
    if (route.query.payment === 'success') {
        user.clearCart()
    }
})

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
    <ProfileLayout>
        <loader :wait-for="order">
            <div class="flex flex-col gap-6">
                <div class="flex">
                    <div class="">
                        <CardTitle>
                            Suivi de la commande
                            <b>n°{{ order?.id }}</b></CardTitle
                        >
                        <CardDescription>
                            Votre commande est
                            {{ statusTranslate[order?.status] }}
                        </CardDescription>
                    </div>
                    <CommandManageMenu :order="order" @update="fetch" />
                </div>

                <div class="flex gap-6">
                    <Card class="px-4 py-3">
                        <CardDescription class="flex items-center gap-2 pb-2">
                            <ion-icon
                                class="text-md"
                                name="location"
                            ></ion-icon>
                            Où votre nain doit aller
                        </CardDescription>
                        <CardTitle class="text-md">{{
                            shippingAddress
                        }}</CardTitle>
                    </Card>
                    <Card class="px-4 py-3">
                        <CardDescription class="flex items-center gap-2 pb-2">
                            <ion-icon
                                class="text-md"
                                name="calendar"
                            ></ion-icon>
                            Date d'achat
                        </CardDescription>
                        <CardTitle class="text-md">
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
                </div>

                <Separator />

                <Card>
                    <CardHeader>
                        <CardDescription>
                            Status de votre commande
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="relative flex flex-col gap-2">
                            <div
                                class="absolute left-[6px] top-[7px] bottom-[7px] w-[2px] border-l-2 border-dashed"
                            ></div>
                            <div
                                class="relative z-10 flex gap-4 items-center"
                                v-for="(
                                    history, index
                                ) in orderStatusHistoryParsed"
                                :key="index"
                            >
                                <div
                                    class="w-[14px] h-[14px] rounded-xl border-2 border-accent"
                                    :class="['bg-' + history.color]"
                                ></div>
                                <Badge :class="['bg-' + history.color]">
                                    {{ history.status }}
                                </Badge>
                                <span class="text-sm"
                                    >le
                                    {{
                                        history.date.toLocaleDateString(
                                            options,
                                        ) +
                                        ' - ' +
                                        history.date.toLocaleTimeString()
                                    }}</span
                                >
                                <Button
                                    v-if="
                                        history.value == 'payment_failed' &&
                                        history.isLast
                                    "
                                    @click="handlePay"
                                    variant="outline"
                                    class="text-red-500 border-red-500"
                                    size="sm"
                                >
                                    Réessayer le paiement
                                    <ion-icon
                                        name="chevron-forward-outline"
                                    ></ion-icon>
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardDescription>
                            Contenu de votre commande
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrderDetailsProductList
                            :order-details="order.OrderDetails"
                        />
                    </CardContent>
                    <Separator />
                    <CardFooter class="pt-4">
                        <div class="flex flex-1 flex-row justify-end">
                            <div>
                                <CardDescription>Total</CardDescription>
                                <CardTitle>{{ order.total }} €</CardTitle>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
                <!-- ADD INVOICE DOCUMENTS COMPONENS  -->
                <DocumentsList :order="order" />
                <!--                          <iframe-->
                <!--                              width="500"-->
                <!--                              height="600"-->
                <!--                              frameborder="0"-->
                <!--                              scrolling="no"-->
                <!--                              marginheight="0"-->
                <!--                              marginwidth="0"-->
                <!--                              src="https://maps.google.com/maps?width=720&amp;height=600&amp;hl=en&amp;q=242%20Rue%20du%20Faubourg%20Saint-Antoine,%2075012%20Paris+()&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"-->
                <!--                          ><a href="https://www.gps.ie/"-->
                <!--                          >gps systems</a-->
                <!--                          ></iframe>-->
            </div>
        </loader>
    </ProfileLayout>
</template>
