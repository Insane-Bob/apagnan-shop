<script setup lang="ts">
const props = defineProps<{
    product: {
        name: string;
        price: number;
        quantity: number;
        imgPath: string;
    };
}>();
</script>

<template>
    <div class="w-full flex py-4 gap-x-12 ">
        <img class="w-1/3" :src="props.product.imgPath" alt="product" />
        <div class="flex flex-col w-full justify-center items-start gap-y-2"> 
                <p class="text-sm">{{ props.product.name }}</p>
                <p class="text-sm">Prix: {{ props.product.price }} €</p>
                <p class="text-sm">Quantité: x{{ props.product.quantity }} </p>
        </div>
    </div>
</template>