<script setup lang="ts">
import {
Select,
SelectContent,
SelectGroup,
SelectItem,
SelectLabel,
SelectTrigger,
SelectValue,
} from '@/components/ui/select';
import Button from '@/components/ui/button/Button.vue';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/toast/use-toast';
import { apiClient } from "@/lib/apiClient";
import { useUserStore } from '@/stores/user';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

import AddressForm from '@/components/views/order/AddressForm.vue';
import type { BasketItem } from '@/types';


const user = useUserStore()
const router = useRouter()
const { toast } = useToast()


// IF user select one of his address
const customAddress = ref(false)

// IF user use same address for billing and shipping
const sameAddress = ref<boolean>(true)

const addressOption = ref('')

// VAR FOR Shipping FORM
const shippingCountry = ref('')
const shippingRegion = ref('')
const shippingCity = ref('')
const shippingPostalCode = ref('')
const shippingStreet = ref('')


// VAR FOR BILLING FORM
const billingCountry = ref('')
const billingRegion = ref('')
const billingCity = ref('')
const billingPostalCode = ref('')
const billingStreet = ref('')


onBeforeMount(() => {
    user.cartViewed()
    if(user.countCartItem === 0){
        toast({
            title: 'Vous n\'avez pas d\'article dans votre panier',
            variant: 'destructive'
        })
        router.push('/home')
    }
})


const onSelectAddressOption = () => {
    if(addressOption.value === 'custom'){
        customAddress.value = true
    }else{
        customAddress.value = false
    }
}

const goToPayment = async () => {
    // router.push('/order/summary')
        let shippingAdresseId 
        let billingAdresseId
    if(addressOption.value === 'custom'){
        shippingAdresseId = await createShippingAddress()
        if(shippingAdresseId === 0){
            toast({
                title: 'Veuillez remplir tous les champs de l\'adresse de livraison',
                variant: 'destructive'
            })
            return
        }
    }else{
        shippingAdresseId = parseInt(addressOption.value)
    }
    if(!sameAddress.value){
        billingAdresseId = await createBillingAddress()
        if(billingAdresseId === 0){
            toast({
                title: 'Veuillez remplir tous les champs de l\'adresse de facturation',
                variant: 'destructive'
            })
            return
        }
    }else{
        billingAdresseId = shippingAdresseId
    }  

    createOrder(shippingAdresseId, billingAdresseId)
}

const createShippingAddress = async ():Promise<number> => {
    if(shippingCountry.value !== '' && shippingRegion.value !== '' && shippingCity.value !== '' && shippingPostalCode.value !== '' && shippingStreet.value !== ''){
    const response  = await apiClient.post('addresses', 
            {
                country: shippingCountry.value,
                region: shippingRegion.value,
                city: shippingCity.value,
                postalCode: shippingPostalCode.value,
                street: shippingStreet.value,
                customerId: user.getCustomerId
            }
        )
        return response.data.id
    }
    return 0
}

const createBillingAddress = async ():Promise<number> => {
    if(billingCountry.value !== '' && billingRegion.value !== '' && billingCity.value !== '' && billingPostalCode.value !== '' && billingStreet.value !== ''){
    const response  = await apiClient.post('addresses', 
            {
                country: billingCountry.value,
                region: billingRegion.value,
                city: billingCity.value,
                postalCode: billingPostalCode.value,
                street: billingStreet.value,
                customerId: user.getCustomerId
            }
        )

        return response.data.id
    }
    return 0
}

const createOrder = async (shippingAddressId: number, billingAddressId: number) => {
    const response = await apiClient.post('orders', {
        customerId: user.getCustomerId,
        shippingAddressId: shippingAddressId,
        billingAddressId: billingAddressId,
        products: user.getCart.map((item: BasketItem) => {
            return {
                productId: item.product.id,
                quantity: item.quantity
            }
        })
    })
    if (response.status === 201) {
        toast({
            title: 'Votre commande a été enregistrée',
        })
        user.clearCart()
        router.push(response.data.id +'/payment')
    }else {
        toast({
            title: 'Une erreur est survenue lors de la création de votre commande',
            variant: 'destructive'
        })
    }
}

</script>

<template>
    <div class="mx-24 my-8 flex gap-x-12">
        <div class="grow flex flex-col">
            <div class="border border-primary/50 w-full flex flex-col items-start justify-center h-min p-2 text-xs">
                <p class="uppercase tracking-wide font-medium">Vous êtes en train de passer une commande en tant que:</p>
                <p>{{user.get.email}}</p>
            </div>

            <div class="mt-12">
                <div class="flex justify-start items-center gap-x-2">
                    <div class="border rounded-full border-primary text-primary aspect-square text-2xl h-10 w-10 flex justify-center items-center">1</div>
                    <h1 class="text-2xl uppercase tracking-wider">
                        Adresse de Livraison
                    </h1>
                </div>
                <small class="font-light">Où devons-nous effectuer la livraison?</small>
                <Select class="my-2" v-model="addressOption" @update:modelValue="onSelectAddressOption()">
                    <SelectTrigger>
                    <SelectValue placeholder="Choisir une adresse" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="custom">-- Définir une adresse --</SelectItem>
                        <SelectGroup v-if="user.getAddresses.length > 0" label="Adresses">
                            <SelectLabel >Adresse Sauvegardée</SelectLabel>
                            <SelectItem v-for="(address, index) in user.getAddresses" :key="index" :value="address.id.toString()">{{ address.street + ', ' + address.city + ' ' + address.postalCode + ', ' + address.country }}</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <form v-if="customAddress">
                <AddressForm v-model:city="shippingCity" v-model:region="shippingRegion" v-model:country="shippingCountry" v-model:postal-code="shippingPostalCode" v-model:street="shippingStreet"  />
            </form>

            <div class="mt-12">
                <div class="flex justify-start items-center gap-x-2">
                    <div class="border rounded-full border-primary text-primary aspect-square text-2xl h-10 w-10 flex justify-center items-center">2</div>
                    <h1 class="text-2xl uppercase tracking-wider">
                        Adresse de facturation
                    </h1>
                </div>
                <small class="font-light">À quelle adresse devons-nous vous facturer?</small>
            </div>
            <div class="flex items-center gap-x-2 mt-4">
                <label class="text-base font-light">Même adresse que l'addresse de livraison.</label>
                <Switch v-model:checked="sameAddress" />

            </div>
            <form v-if="!sameAddress">
                <AddressForm v-model:city="billingCity" v-model:region="billingRegion" v-model:country="billingCountry" v-model:postal-code="billingPostalCode" v-model:street="billingStreet"  />
            </form>

            <Button @click="goToPayment" class="mt-4 max-w-md min-w-fit uppercase tracking-wider">Passer au paiement</Button>
        </div>

        

        <aside class="w-96 px-12 py-8 h-full border border-primary/50 flex flex-col items-center">
            <h1 class="text-center uppercase tracking-wide font-bold">Récapitulatif</h1>
            <h2 class="text-center uppercase tracking-wide font-bold whitespace-nowrap flex justify-center items-center gap-x-1">
                {{ user.countCartItem }}
                Article{{ user.countCartItem > 1 ? 's' : '' }}
            </h2>
            <hr class="border-b-[0.5px] border-primary/40 my-4 w-full">
            
            <div class="flex w-full justify-between ">
                <img 
                    class="w-14 h-14 relative mr-8"
                    src="/src/assets/images/noPhotoAvailable.webp"
                    alt="placeholder"
                />
                <div class="flex flex-col grow">
                    <div class="flex justify-between items-start grow gap-x-1 text-xs">
                        <p class="uppercase font-medium">Nom du produit un peu long</p>
                        <p class="uppercase font-light whitespace-nowrap ">Qté:  1</p>
                    </div>
                    <p class="w-full text-right text-xs">€ 400,00</p>
                </div>
            </div>

            <hr class="border-b-[0.5px] border-primary/40 my-4 w-full">
            <div class="flex flex-col w-full text-sm gap-y-4">
                <div class="flex justify-between items-center w-full font-light">
                    <p>Sous-total</p>
                    <p>€ 400,00</p>
                </div>

                <div class="flex justify-between items-center w-full font-light">
                    <p>Livraison</p>
                    <p>€ 0 (offerte)</p>
                </div>

                <div class="flex justify-between items-center w-full font-medium text-sm uppercase tracking-wide">
                    <p>Total</p>
                    <p>€ 400 </p>
                </div>

                <div class="flex justify-between items-center w-full font-light">
                    <p>TVA</p>
                    <p>€ 100,00</p>
                </div>
            </div>
        </aside>
    </div>
</template>