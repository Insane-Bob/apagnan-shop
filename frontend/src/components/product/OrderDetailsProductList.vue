<script setup lang="ts">
import type {OrderDetailsWithProducts} from "@/types/OrderDetails";
import Button from "@components/ui/button/Button.vue";
import {useCart} from "@/composables/useCart";
import {ref} from "vue";

const props = defineProps<{
  orderDetails: OrderDetailsWithProducts[]
  buyNew : bigint
}>()

async function reorder(detail : OrderDetailsWithProducts) {
  const cart = useCart(ref(detail.Product))
  await cart.addToCart()
}


</script>

<template>
  <div v-for="orderDetail in props.orderDetails">
    <div class="flex flex-row justify-between">
      <div class="flex gap-2">
        <img src="https://placekitten.com/200/200" alt="product" class="w-16 h-16 object-cover rounded-sm"/>
        <div>
          <p>{{ orderDetail.Product.name }}</p>
          <p class="text-slate-400">{{ orderDetail.quantity }} x {{ orderDetail.unitPrice }} €</p>
        </div>

      </div>
      <div class="text-right">
        <p class="text-lg font-medium">{{ orderDetail.total }} €</p>
        <Button variant="ghost" class="text-primary" @click="()=>reorder(orderDetail)">Ajouter au panier</Button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>