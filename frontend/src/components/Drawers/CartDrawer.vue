<script setup lang="ts">
import {
SheetContent,
SheetHeader,
SheetTitle
} from '@/components/ui/sheet';

import CartCard from '@components/cards/CartCard.vue';
import Button from '@components/ui/button/Button.vue';
import { onMounted } from 'vue';
import { apiClient } from '@/lib/apiClient'
const userId = JSON.parse(localStorage.getItem('user') as string).user.id


onMounted(() => {
    fetchCart()
})

const fetchCart = async () => {
    const response = await apiClient.get('/users/' + userId + '/basket')
    const data = response.data
    data.product.forEach((c: any) => {
        console.log(c)
    })
}


const products = [
    {
        id: 1,
        name: 'product-1',
        price: 10,
        quantity: 1,
        imgPath: 'https://via.placeholder.com/150'
    },
    {
        id: 2,
        name: 'product-2',
        price: 20,
        quantity: 2,
        imgPath: 'https://via.placeholder.com/150'
    },
    {
        id: 3,
        name: 'product-3',
        price: 30,
        quantity: 3,
        imgPath: 'https://via.placeholder.com/150'
    }
]
</script>

<template>
    <SheetContent class="flex flex-col">
    <SheetHeader>
        <SheetTitle class="uppercase tracking-wider">Ajouté au panier</SheetTitle>
    </SheetHeader>
    <div  class="w-full max-h-[80vh] overflow-y-scroll grow flex flex-col justify-start divide-y divide-primary">
        <div v-for="product in products" :key="product.id" class="flex flex-col justify-start">
            <CartCard :product="product" />
        </div>
    </div>
    <Button class="w-full uppercase tracking-wider font-light">Règlement</Button>
    </SheetContent>
</template>