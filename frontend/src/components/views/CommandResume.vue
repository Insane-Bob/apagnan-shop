<script setup lang="ts">
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import CardDescription from '../ui/card/CardDescription.vue'
import { apiClient } from '@/lib/apiClient'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Order } from '@/types'
import CardTitle from '@components/ui/card/CardTitle.vue'
import Separator from '@components/ui/separator/Separator.vue'
import Loader from '@components/ui/loader/Loader.vue'
import Dialog from '@components/ui/dialog/Dialog.vue'
import DialogTrigger from '@components/ui/dialog/DialogTrigger.vue'
import DialogContent from '@components/ui/dialog/DialogContent.vue'
import RefundRequestForm from '@components/Forms/RefundRequestForm.vue'

const isRefundDialogOpen = ref(false)

const options = { year: 'numeric', month: 'long', day: 'numeric' }

const route = useRoute()

const stapes = ref<{ status: string; date: Date; description: string }[]>([])

const order = ref<Order>()
const shippingAddress = ref<string>()

const statusTranslate = {
    pending: 'En attente',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    refunded: 'Remboursée',
    cancelled: 'Annulée',
}

const statusDescription = {
    pending: 'Votre nain est en cours de préparation',
    shipped: 'Votre nain est en route',
    delivered: 'Votre nain est arrivé à destination',
    refunded: 'Votre nain a été remboursé',
    cancelled: 'Votre nain a été annulé',
}

const orderStatusHistoryParsed = computed(() => {
    return order.value?.statusHistory.map((status) => {
        return {
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
</script>

<template>
    <loader :wait-for="order">
        <div class="px-4 sm:px-16 lg:px-24">
            <div class="pt-12 pb-10">
                <CardTitle>
                    Suivi de la commande <b>n°{{ order?.id }}</b></CardTitle
                >
                <CardDescription
                    >Votre commande est
                    {{ statusTranslate[order?.status] }}</CardDescription
                >
            </div>

            <div
                class="flex flex-col-reverse lg:flex-row flex-nowrap h-full gap-x-4"
            >
                <menu class="flex-1 flex flex-col gap-y-3">
                    <Card
                        v-for="(history, index) in orderStatusHistoryParsed"
                        :key="index"
                        class="border rounded-sm w-full border-primary-accent px-4 border-l-4 border-r-primary shadow"
                    >
                        <CardHeader class="pb-2">
                            <CardTitle>{{ history.status }}</CardTitle>
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
                    </Card>
                    <Separator class="my-5" />
                    <Card
                        class="border rounded-sm w-full border-primary-accent px-4 border-l-4 border-r-primary shadow"
                    >
                        <CardHeader>
                            <CardTitle>Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div class="flex flex-col gap-y-2">
                                <button
                                    v-if="order.status === 'shipped'"
                                    class="bg-primary text-white py-2 rounded-sm"
                                >
                                    Suivre ma commande
                                </button>
                                <Dialog v-model:open="isRefundDialogOpen">
                                    <DialogTrigger
                                        v-if="
                                            order.RefundRequestOrders.filter(
                                                (r) => !r.approved,
                                            ).length === 0
                                        "
                                    >
                                        <button
                                            v-if="order.status === 'delivered'"
                                            class="bg-primary text-white py-2 px-8 rounded-sm mr-auto"
                                        >
                                            Demander un remboursement
                                        </button>
                                    </DialogTrigger>
                                    <template v-else>
                                        <button
                                            :disabled="true"
                                            class="bg-gray-400 text-white py-2 px-8 rounded-sm mr-auto"
                                        >
                                            Demander un remboursement
                                        </button>
                                        <small class="italic opacity-50">
                                            Une demande de remboursement est en
                                            cours de validation
                                        </small>
                                    </template>
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
                        </CardContent>
                    </Card>
                </menu>

                <hr
                    class="w-full border-t-2 border-dashed border-primary lg:hidden my-4"
                />

                <div class="flex-1 rounded-sm pt-2 px-2">
                    <div class="rounded-sm border border-primary-accent">
                        <div style="width: 100%">
                            <iframe
                                width="720"
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
                    <div class="flex flex-col space-y-2 py-4">
                        <CardTitle>
                            Les informations de votre commande</CardTitle
                        >
                        <div>
                            <CardDescription>
                                Où votre nain doit aller :
                            </CardDescription>
                            <p class="text-slate-600 italic">
                                {{ shippingAddress }}
                            </p>
                        </div>
                        <div>
                            <CardDescription> Date d'achat : </CardDescription>
                            <p class="text-slate-600 italic">
                                {{
                                    new Date(
                                        order?.createdAt as string,
                                    ).toLocaleDateString(options) +
                                    ' - ' +
                                    new Date(
                                        order?.createdAt as string,
                                    ).toLocaleTimeString()
                                }}
                            </p>
                        </div>
                        <div>
                            <CardDescription>
                                Date de livraison prévue :
                            </CardDescription>
                            <p class="text-slate-600 italic">
                                28/01/2023 12h-16h
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </loader>
</template>
