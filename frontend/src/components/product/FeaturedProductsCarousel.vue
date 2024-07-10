<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
</script>

<template>
  <Carousel class="relative w-full max-w-[14rem] md:max-w-2xl">
    <CarouselContent>
      <CarouselItem class="basis-1/3 mx-4 md:mx-8 flex flex-col items-center">
        <img src="/src/assets/images/green-gnome.png" alt="green gnome" class="" />
        <h3 class="text-lg font-semibold">NainBle</h3>
        <p class="text-center">€ 910</p>
      </CarouselItem>
      <CarouselItem class="basis-1/3 mx-4 md:mx-8 flex flex-col items-center">
        <img src="/src/assets/images/green-gnome.png" alt="green gnome" class="" />
        <h3 class="text-lg font-semibold">NainBle</h3>
        <p class="text-center">€ 910</p>
      </CarouselItem>
      <CarouselItem class="basis-1/3 mx-4 md:mx-8 flex flex-col items-center">
        <img src="/src/assets/images/green-gnome.png" alt="green gnome" class="" />
        <h3 class="text-lg font-semibold">NainBle</h3>
        <p class="text-center">€ 910</p>
      </CarouselItem>
      <CarouselItem class="basis-1/3 mx-4 md:mx-8 flex flex-col items-center">
        <img src="/src/assets/images/green-gnome.png" alt="green gnome" class="" />
        <h3 class="text-lg font-semibold">NainBle</h3>
        <p class="text-center">€ 910</p>
      </CarouselItem>
      <CarouselItem class="basis-1/3 mx-4 md:mx-8 flex flex-col items-center">
        <img src="/src/assets/images/green-gnome.png" alt="green gnome" class="" />
        <h3 class="text-lg font-semibold">NainBle</h3>
        <p class="text-center">€ 910</p>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>
