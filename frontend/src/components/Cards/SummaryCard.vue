<script setup lang="ts">
import BasketItem from "@/types";

defineProps<{item: BasketItem}>();


</script>

<template>
    <div class="flex w-full justify-between ">
        <img 
            class="w-14 h-14 relative mr-8 object-contain"
            :src="item.product.mainImage.url"
            alt="placeholder"
        />
        <div class="flex flex-col grow">
            <div class="flex justify-between items-start grow gap-x-1 text-xs">
                <p class="uppercase font-medium">{{ item.product.name }}</p>
                <p class="uppercase font-light whitespace-nowrap ">Qté:  {{ item.quantity }}</p>
            </div>
            <p class="w-full text-right text-xs">{{  item.product.priceFormatted }}</p>
        </div>
    </div>

    <hr class="border-b-[0.5px] border-primary/40 my-4 w-full">
</template>