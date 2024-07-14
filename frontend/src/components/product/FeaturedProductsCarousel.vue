<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import type { Product } from '@/types';
defineProps({
  products: Array<Product>
})
</script>

<template>
  <Carousel class="relative w-full max-w-[14rem] md:max-w-2xl">
    <CarouselContent>
      <CarouselItem v-for="(product, index) in products" :key="index" class="basis-1/3 mx-4 md:mx-8 flex flex-col items-center">
        <img :src="product.images.length > 0? '/src/'+product.images[0].path: '/src/assets/images/noPhotoAvailable.webp'" alt="green gnome" class="" />
        <h3 class="text-lg font-semibold">{{ product.name }}</h3>
        <p class="text-center">€ {{ product.price }}</p>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>
