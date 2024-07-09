<script setup lang="ts">
import {
SheetClose,
SheetContent,
SheetHeader,
SheetTitle
} from '@/components/ui/sheet';

import type { BasketItem } from '@/types';
import CartCard from '@components/cards/CartCard.vue';
import Button from '@components/ui/button/Button.vue';
import { useUserStore } from '@store/user';
import { RouterLink } from 'vue-router';

const user = useUserStore()

user.cartViewed()


</script>

<template>
    <SheetContent class="flex flex-col">
    <SheetHeader>
        <SheetTitle class="uppercase tracking-wider">Ajouté au panier</SheetTitle>
    </SheetHeader>
    <div  class="w-full max-h-[80vh] overflow-y-scroll grow flex flex-col justify-start divide-y divide-primary">
        <div v-if="user.countCartItem > 0" class="flex flex-col justify-start">
            <CartCard v-for="(item, index) in user.getCart" :key="index"  :product="item.product" :quantity="item.quantity" />
        </div>
        <div v-else class="flex flex-col items-center">
            <p class="text-lg font-semibold text-center my-5">Votre panier est vide</p>
            <RouterLink to="/products">
                <SheetClose>
                    <Button>Voir la boutique</Button>
                </SheetClose>
            </RouterLink>
        </div>
    </div>
    <div class="flex flex-col">
        <h2 class="text-xl font-bold">Récapitulatif</h2>
        <div class="flex justify-between items-center">
            <p class="text-lg font-semibold">Total:</p>
            <p class="text-lg font-semibold">{{ user.getCart.reduce((acc: number, item:BasketItem) => acc + item.product.price * item.quantity, 0) }} €</p>
        </div>
        <hr class="border-b-2 border-primary my-3"/>
        <Button class="w-full uppercase tracking-wider font-light">Règlement</Button>
    </div>
    </SheetContent>
</template>