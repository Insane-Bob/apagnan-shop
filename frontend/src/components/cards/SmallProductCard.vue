<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { Button } from '@components/ui/button';
import SmallProductCardSkeleton from './SmallProductCardSkeleton.vue';

const props = defineProps({
  name: String,
  collection: String,
  price: Number,
  image: String,
  loading: Boolean,
});

</script>

<template>
  <article v-if="!loading" class="flex-col w-[272px]">
        <div class="w-[272px] h-[350px] bg-primary">
            <img :src="props.image" alt="product image" class="w-full h-full object-cover">
        </div>
        <div class="flex justify-between mb-2">
          <div class="flex flex-col">
            <h1 class="text-[#C9C9C9]">{{ props.collection }}</h1>
            <h2>{{ props.name }}</h2>
            <p>{{props.price}}€</p>
          </div>

        </div>
    </article>
    <SmallProductCardSkeleton v-else />
</template>
