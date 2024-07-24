<script setup lang="ts">
import DataTable from '@/components/tables/DataTable.vue'
import { ApiClient } from '@/lib/apiClient'
import type { Order, TableColumns } from '@/types'
import type { OrderStatus } from '@/types/OrderStatus'
import { useUserStore } from '@store/user'
import { onMounted, reactive, ref } from 'vue'
import Button from '../ui/button/Button.vue'
import type { TableActions } from '@/types'
import { useRouter } from 'vue-router'
import { useSort } from '@/composables/useSort'
import Card from '@components/ui/card/Card.vue'
import CardDescription from '@components/ui/card/CardDescription.vue'
import CardTitle from '@components/ui/card/CardTitle.vue'
import CardHeader from '@components/ui/card/CardHeader.vue'
import ProfileLayout from '@/layout/ProfileLayout.vue'
import Separator from '@components/ui/separator/Separator.vue'
import CardContent from '@components/ui/card/CardContent.vue'
import CardFooter from '@components/ui/card/CardFooter.vue'
import OrderDetailsProductList from '@components/product/OrderDetailsProductList.vue'
import { Money } from '../../utils/money'
import { OrderFormat } from '../../utils/orderFormat'

const apiClient = new ApiClient()

const router = useRouter()
const user = useUserStore()
const { dataTableSort } = useSort()
const loading = ref(true)

const orders = reactive<Order[]>([])

const statusTranslate = {
    pending: 'En attente',
    processing: 'En cours de traitement',
    paid: 'Payée',
    payment_failed: 'Paiement échoué',
    cancel: 'Annulée',
    shipped: 'Expédiée',
    delivered: 'Livrée',
    refunded: 'Remboursée',
    cancelled: 'Annulée',
}

onMounted(async () => {
    await fetchOrders()
    loading.value = false
})

const fetchOrders = async () => {
    const response = await apiClient.get(
        '/users/' +
            user.getId +
            '/orders?withProducts=true&order=createdAt&direction=desc',
    )
    const data = response.data.data
    data.forEach((c: any) => {
        orders.push(c)
    })
}
</script>
<template>
    <ProfileLayout>
        <div class="flex flex-col gap-6">
            <h1 class="text-2xl font-bold uppercase tracking-wider">
                Mes commandes
            </h1>
            <div class="flex gap-6">
                <Card>
                    <CardHeader>
                        <CardDescription> Commandes passés </CardDescription>
                        <CardTitle>
                            {{ orders.length }}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardDescription> Commandes en cours </CardDescription>
                        <CardTitle>
                            {{
                                orders.filter((o) =>
                                    [
                                        'pending',
                                        'paid',
                                        'processing',
                                        'shipped',
                                    ].includes(o.status),
                                ).length
                            }}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div class="flex gap-3 items-center">
                <CardDescription class="text-nowrap">
                    Historique des commandes passés
                </CardDescription>
                <Separator class="grow w-auto" />
            </div>

            <div
                v-if="orders.length"
                class="max-h-[600px] overflow-y-auto flex flex-col gap-4"
            >
                <Card v-for="order in orders" :key="order.id">
                    <CardHeader class="flex flex-row justify-between">
                        <div>
                            <CardDescription>
                                Commande
                                {{ OrderFormat.formatOrderNumber(order.id) }}
                            </CardDescription>
                            <CardTitle>
                                {{ statusTranslate[order.status] }}
                            </CardTitle>
                        </div>
                        <div>
                            <RouterLink :to="'/profile/command/' + order.id">
                                <Button
                                    variant="ghost"
                                    class="font-bold flex gap-4 text-primary"
                                    >Voir le détail
                                    <ion-icon
                                        name="chevron-forward-outline"
                                    ></ion-icon>
                                </Button>
                            </RouterLink>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <CardDescription class="mb-2">Produits</CardDescription>
                        <OrderDetailsProductList
                            :order-details="order.OrderDetails"
                        />
                    </CardContent>
                    <Separator />
                    <CardFooter class="pt-4">
                        <div class="flex flex-1 flex-row justify-between">
                            <div>
                                <CardDescription>Crée le</CardDescription>
                                {{
                                    new Date(
                                        order.createdAt.slice(
                                            0,
                                            order.createdAt.indexOf('T'),
                                        ),
                                    ).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })
                                }}
                            </div>
                            <div>
                                <CardDescription>Total</CardDescription>
                                <CardTitle>
                                    {{
                                        Money.format(
                                            order.total -
                                                (order.Promo
                                                    ? order.Promo.type ===
                                                      'percent'
                                                        ? (order.Promo.value /
                                                              100) *
                                                          order.total
                                                        : order.Promo.value
                                                    : 0),
                                        )
                                    }}
                                </CardTitle>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
            </div>
            <div v-else>
                <h2 class="text-primary text-sm">
                    Vous n'avez pas encore passé de commande
                </h2>
                <div
                    class="flex flex-col gap-y-7 justify-center items-center mt-6"
                >
                    <img
                        src="/images/goToShop.webp"
                        alt="aller dans la boutique"
                        class="w-1/2 h-1/2 object-cover rounded-sm"
                    />
                    <RouterLink to="/products"
                        ><Button>Aller dans la boutique</Button></RouterLink
                    >
                </div>
            </div>
        </div>
    </ProfileLayout>
</template>
