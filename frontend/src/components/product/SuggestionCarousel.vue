<script setup lang="ts">
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import type { Collection, Product } from '@/types';
import type {Suggestion} from "@/types/Suggestion";
defineProps<{
  suggestions: Suggestion[]
}>()

</script>

<template>
  <Carousel class="relative w-full ">
    <CarouselContent>
      <RouterLink v-for="(suggestion, index) in suggestions" :key="index"  :to="suggestion?.url">
        <CarouselItem class="basis-1/3 mx-4 md:mx-8 flex flex-col items-center">
          <slot name="item" v-bind:="{suggestion}"></slot>
        </CarouselItem>
      </RouterLink>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>
