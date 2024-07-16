<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import ProductCardSkeleton from '@/components/Cards/ProductCardSkeleton.vue';

const props = defineProps({
  name: String,
  shortDescription: String,
  price: Number,
  image: String,
  loading: Boolean,
})
</script>

<template>
  <article v-if="!loading" class="flex-col w-[366px]">
    <div class="w-[366px] h-[471px] bg-primary">
      <img :src="props.image" alt="product image" class="w-full h-full object-cover" />
    </div>
    <div class="flex justify-between mb-2">
      <div class="flex flex-col">
        <h1 class="text-[#C9C9C9]">{{ props.name }}</h1>
        <h2>{{ props.shortDescription }}</h2>
      </div>

      <div class="text-lg flex flex-col justify-end">
        <p>{{ props.price }}€</p>
      </div>
    </div>
    <Button class="w-full">Acheter</Button>
  </article>
  <ProductCardSkeleton v-else />
</template>
