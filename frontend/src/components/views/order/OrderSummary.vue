<script setup lang="ts">

import FormInput from '@/components/Inputs/FormInput.vue'
import Button from '@/components/ui/button/Button.vue'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/toast/use-toast'
import { ApiClient } from '@/lib/apiClient'
import { useUserStore } from '@/stores/user'
import { onBeforeMount, onUnmounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import SummaryCard from '@components/Cards/SummaryCard.vue'

import AddressForm from '@/components/views/order/AddressForm.vue'
import type { BasketItem, Promo } from '@/types'
import { usePaymentBroadcastChannel } from '@/composables/usePaymentBroadcastChannel'
import CardHeader from '@components/ui/card/CardHeader.vue'
import Card from '@components/ui/card/Card.vue'
import CardDescription from '@components/ui/card/CardDescription.vue'
import CardContent from '@components/ui/card/CardContent.vue'
import Avatar from '@components/ui/avatar/Avatar.vue'
import AvatarFallback from '@components/ui/avatar/AvatarFallback.vue'
import Badge from '@components/ui/badge/Badge.vue'
import CardTitle from '@components/ui/card/CardTitle.vue'
import CardFooter from '@components/ui/card/CardFooter.vue'
import FormGrid from '@/components/Forms/FormGrid.vue'
import { Money } from '@/utils/money'

const apiClient = new ApiClient()

const user = useUserStore()
const router = useRouter()
const { toast } = useToast()

// IF user select one of his address
const customAddress = ref(false)
const billingCustomAddress = ref(false)

// IF user use same address for billing and shipping
const sameAddress = ref<boolean>(true)

const addressOption = ref('')
const billingAddressOption = ref('')

// VAR FOR Shipping FORM
const shippingCountry = ref('')
const shippingRegion = ref('')
const shippingCity = ref('')
const shippingPostalCode = ref('')
const shippingStreet = ref('')
const shippingErrors = reactive({
    country: '',
    region: '',
    city: '',
    postalCode: '',
    street: '',
})

// VAR FOR BILLING FORM
const billingCountry = ref('')
const billingRegion = ref('')
const billingCity = ref('')
const billingPostalCode = ref('')
const billingStreet = ref('')
const billingErrors = reactive({
    country: '',
    region: '',
    city: '',
    postalCode: '',
    street: '',
})

// VAR FOR STYLE

const waitingPaymentModal = ref(false)

// VAR FOR PROMO CODE

const promoCode = ref('')
const promoError = ref('')
const promo = reactive<Promo>({} as Promo)

usePaymentBroadcastChannel()

onBeforeMount(() => {
    user.cartViewed()
    if (user.countCartItem === 0) {
        toast({
            title: "Vous n'avez pas d'article dans votre panier",
            variant: 'destructive',
        })
        router.push('/home')
    }
})

const onSelectAddressOption = () => {
    if (addressOption.value === 'custom') {
        customAddress.value = true
    } else {
        customAddress.value = false
    }
}

const onSelectBillingAddressOption = () => {
    if (billingAddressOption.value === 'custom') {
        billingCustomAddress.value = true
    } else {
        billingCustomAddress.value = false
    }
}

const goToPayment = async () => {
    let shippingAdresseId
    let billingAdresseId

    if (addressOption.value === '') {
        toast({
            title: 'Veuillez choisir une adresse de livraison',
            variant: 'destructive',
            duration: 2000,
        })
        return
    }

    if (addressOption.value === 'custom') {
        shippingAdresseId = await createShippingAddress()
        if (shippingAdresseId === 0) {
            toast({
                title: "Veuillez remplir tous les champs de l'adresse de livraison",
                variant: 'destructive',
                duration: 2000,
            })
            return
        }
        addressOption.value = shippingAdresseId.toString()
        customAddress.value = false
    } else {
        shippingAdresseId = parseInt(addressOption.value)
    }
    
    if (!sameAddress.value) {
        if(billingAddressOption.value === 'custom') {
        billingAdresseId = await createBillingAddress()
        if (billingAdresseId === 0) {
            toast({
                title: "Veuillez remplir tous les champs de l'adresse de facturation",
                variant: 'destructive',
            })
            return
        }
        billingAddressOption.value = billingAdresseId.toString()
        billingCustomAddress.value = false
        } else {
            billingAdresseId = parseInt(billingAddressOption.value)
        }
    } else {
        billingAdresseId = shippingAdresseId
    }

    const orderId = await createOrder(shippingAdresseId, billingAdresseId)

    waitingPaymentModal.value = true

    const response = await apiClient.post(`/orders/${orderId}/pay`, {
        discounts: promo.stripeId ? [{ promotion_code: promo.stripeId }] : [],
    })

    if (response.data.url && orderId !== 0) {
        window.open(response.data.url, '_blank')
        waitingPaymentModal.value = false
    } else {
        toast({
            title: 'Une erreur est survenue lors de la création de votre commande',
            variant: 'destructive',
        })
    }
}

const createShippingAddress = async (): Promise<number> => {
    shippingErrors.city = ''
    shippingErrors.country = ''
    shippingErrors.region = ''
    shippingErrors.postalCode = ''
    shippingErrors.street = ''

    if (
        shippingCountry.value !== '' &&
        shippingRegion.value !== '' &&
        shippingCity.value !== '' &&
        shippingPostalCode.value !== '' &&
        shippingStreet.value !== ''
    ) {
        try {
            const response = await apiClient.post('addresses', {
                country: shippingCountry.value,
                region: shippingRegion.value,
                city: shippingCity.value,
                postalCode: shippingPostalCode.value,
                street: shippingStreet.value,
                customerId: user.getCustomerId,
            })

            const addresses = user.getAddresses
            addresses.push(response.data)

            user.setAddresses(addresses)

            return response.data.id
        } catch (e: any) {
            if (e.response.status === 422) {
                for (const error of e.response.data.errors) {
                    // @ts-ignore
                    shippingErrors[error.path] = error.message
                }
                return 0
            }
        }
    }
    return 0
}

const createBillingAddress = async (): Promise<number> => {
    billingErrors.city = ''
    billingErrors.country = ''
    billingErrors.region = ''
    billingErrors.postalCode = ''
    billingErrors.street = ''

    if (
        billingCountry.value !== '' &&
        billingRegion.value !== '' &&
        billingCity.value !== '' &&
        billingPostalCode.value !== '' &&
        billingStreet.value !== ''
    ) {
        try {
            const response = await apiClient.post('addresses', {
                country: billingCountry.value,
                region: billingRegion.value,
                city: billingCity.value,
                postalCode: billingPostalCode.value,
                street: billingStreet.value,
                customerId: user.getCustomerId,
            })

            const addresses = user.getAddresses
            addresses.push(response.data)

            user.setAddresses(addresses)

            return response.data.id
        } catch (e: any) {
            if (e.response.status === 422) {
                for (const error of e.response.data.errors) {
                    // @ts-ignore
                    billingErrors[error.path] = error.message
                }
                return 0
            }
        }
    }
    return 0
}

const createOrder = async (
    shippingAddressId: number,
    billingAddressId: number,
) => {
    const props: any = {
        customerId: user.getCustomerId,
        shippingAddressId: shippingAddressId,
        billingAddressId: billingAddressId,
        products: user.getCart.map((item: BasketItem) => {
            return {
                productId: item.product.id,
                quantity: item.quantity,
            }
        }),
    }

    if (promo.id) {
        props.promoId = promo.id
    }

    const response = await apiClient.post('orders', props)
    if (response.status === 201) {
        toast({
            title: 'Votre commande a été enregistrée',
            duration: 1000,
        })
        // user.clearCart()
        return response.data.id
    } else {
        toast({
            title: 'Une erreur est survenue lors de la création de votre commande',
            variant: 'destructive',
            duration: 2000,
        })
        return 0
    }
}

const goBack = () => {
    router.back()
}

const searchPromoCode = async () => {
    try {
        const response = await apiClient.get(
            `/promo-codes/${promoCode.value.trim().toUpperCase()}`,
        )

        promo.code = response.data.promo.code
        promo.id = response.data.promo.id
        promo.type = response.data.promo.type
        promo.stripeId = response.data.promo.stripeId
        promo.value = response.data.promo.value

        promoError.value = ''
    } catch (e: any) {
        if (e.response.status === 404) {
            promo.code = ''
            promo.stripeId = ''
            promoError.value = 'Code promo invalide'
            return
        }
    }
}

const removePromo = () => {
    promo.code = ''
    promo.stripeId = ''
}
</script>

<template>
    <div class="bg-slate-50 py-12 flex-1">
        <div class="max-w-[1000px] mx-auto flex flex-col gap-12">
            <div>
                <Button
                    variant="ghost"
                    @click="goBack()"
                    class="flex items-center gap-x-2 hover:text-primary duration-150"
                >
                    <ion-icon name="arrow-back-outline"></ion-icon>
                    Revenir en arrière
                </Button>
            </div>
            <div class="grid grid-cols-5 gap-12">
                <div class="col-span-3 flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <div class="flex gap-4 items-center font-medium">
                                <Avatar>
                                    <AvatarFallback>
                                        {{
                                            user.get.firstName.charAt(0) +
                                            user.get.lastName.charAt(0)
                                        }}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    {{ user.identity }}
                                    <small class="text-slate-400 block">{{
                                        user.get.email
                                    }}</small>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>
                    <Card>
                        <CardHeader class="pb-2">
                            <div class="flex gap-2 font-medium">
                                <Badge>1</Badge>Addresse de livraison
                            </div>
                        </CardHeader>
                        <CardContent>
                            <small class="font-light block mb-2">
                                Où devons-nous effectuer la livraison?
                            </small>
                                <AddressForm
                                    @updateSelect="onSelectAddressOption"
                                    :errors="shippingErrors"
                                    v-model:customAddress="customAddress"
                                    v-model:addressOption="addressOption"
                                    v-model:city="shippingCity"
                                    v-model:region="shippingRegion"
                                    v-model:country="shippingCountry"
                                    v-model:postal-code="shippingPostalCode"
                                    v-model:street="shippingStreet"
                                />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader class="pb-2">
                            <div class="flex gap-2 font-medium">
                                <Badge>2</Badge>Addresse de facturation
                            </div>
                        </CardHeader>
                        <CardContent>
                            <small class="font-light">
                                À quelle adresse devons-nous vous facturer?
                            </small>
                            <div class="flex items-center gap-x-2 mt-4">
                                <label class="text-base font-light">
                                    Même adresse que l'addresse de
                                    livraison.</label
                                >
                                <Switch v-model:checked="sameAddress" />
                            </div>
                            <form v-if="!sameAddress" class="pt-2">
                                <AddressForm
                                    :errors="billingErrors"
                                    @updateSelect="onSelectBillingAddressOption"
                                    v-model:customAddress="billingCustomAddress"
                                    v-model:addressOption="billingAddressOption"
                                    v-model:city="billingCity"
                                    v-model:region="billingRegion"
                                    v-model:country="billingCountry"
                                    v-model:postal-code="billingPostalCode"
                                    v-model:street="billingStreet"
                                />
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <Card class="col-span-2">
                    <CardHeader>
                        <CardTitle> Récapitulatif </CardTitle>
                        <CardDescription>
                            {{ user.countCartItem }}
                            Article{{ user.countCartItem > 1 ? 's' : '' }}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SummaryCard
                            v-for="(item, index) in user.getCart"
                            :key="index"
                            :item="item"
                        />
                        <div class="flex flex-col gap-4 font-light">
                            <div class="flex justify-between items-center">
                                Sous-total
                                <span>
                                    {{
                                        Money.format(
                                            user.getCart.reduce(
                                                (
                                                    acc: number,
                                                    item: BasketItem,
                                                ) =>
                                                    acc +
                                                    item.product.price *
                                                        item.quantity,
                                                0,
                                            ),
                                        )
                                    }}
                                </span>
                            </div>
                            <div class="flex justify-between items-center">
                                Livraison
                                <p>0.00€ (offerte)</p>
                            </div>

                            <div
                                v-if="promo.code"
                                class="flex justify-between items-center relative"
                            >
                                Code promo
                                <p
                                    @click="removePromo()"
                                    class="peer hover:line-through cursor-pointer"
                                >
                                    -{{
                                        promo.type === 'percent'
                                            ? promo.value + '%'
                                            : promo.value + '€'
                                    }}
                                    (<span class="tracking-wider">{{
                                        promo.code
                                    }}</span
                                    >)
                                </p>
                                <span
                                    class="peer-hover:block hidden text-white bg-black duration-100 absolute top-0 right-0 -translate-y-full z-30 px-1 py-1 rounded-sm cursor-default select-none"
                                    >Supprimer le code promo</span
                                >
                            </div>

                            <div
                                class="flex justify-between items-center font-medium text-sm uppercase"
                            >
                                Total
                                <p>
                                    {{
                                        Money.format(
                                            user.getCart.reduce(
                                                (
                                                    acc: number,
                                                    item: BasketItem,
                                                ) =>
                                                    acc +
                                                    item.product.price *
                                                        item.quantity,
                                                0,
                                            ) -
                                                (promo.value
                                                    ? promo.type === 'amount'
                                                        ? promo.value
                                                        : (user.getCart.reduce(
                                                              (
                                                                  acc: number,
                                                                  item: BasketItem,
                                                              ) =>
                                                                  acc +
                                                                  item.product
                                                                      .price *
                                                                      item.quantity,
                                                              0,
                                                          ) *
                                                              promo.value) /
                                                          100
                                                    : 0),
                                        )
                                    }}
                                </p>
                            </div>

                            <div class="flex justify-between items-center">
                                TVA
                                <p>
                                    {{
                                        Money.format(
                                            user.getCart.reduce(
                                                (
                                                    acc: number,
                                                    item: BasketItem,
                                                ) =>
                                                    acc +
                                                    item.product.price *
                                                        item.quantity,
                                                0,
                                            ) * 0.2,
                                        )
                                    }}
                                </p>
                            </div>
                        </div>

                        <div>
                            <form @submit.prevent="searchPromoCode()">
                                <FormGrid>
                                    <FormInput class="col-span-6">
                                        <template #input="inputProps">
                                            <input
                                                type="text"
                                                v-model="promoCode"
                                                v-bind="inputProps"
                                                placeholder="Code Promo"
                                            />
                                        </template>
                                    </FormInput>
                                    <Button
                                        variant="accent"
                                        class="col-span-6 self-center"
                                        >Appliquer</Button
                                    >
                                    <small
                                        v-if="promoError"
                                        class="text-red-500 text-sm col-span-12"
                                        >{{ promoError }}</small
                                    >
                                </FormGrid>
                            </form>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button
                            @click="goToPayment"
                            class="mt-4 w-full uppercase"
                            :variant="
                                waitingPaymentModal ? 'secondary' : 'default'
                            "
                        >
                            {{
                                waitingPaymentModal
                                    ? 'Chargement...'
                                    : 'Passer au paiement'
                            }}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    </div>
</template>
