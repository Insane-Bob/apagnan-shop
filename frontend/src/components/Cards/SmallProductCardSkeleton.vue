<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import Skeleton from '@components/ui/skeleton/Skeleton.vue';


</script>

<template>
  <article class="flex-col w-[272px]">
        <div class="w-[272px] h-[350px]">
            <Skeleton alt="product image" class="w-[272px] h-full" />
        </div>
          <div class="flex flex-col gap-y-1 mt-2">
            <Skeleton class="w-full h-4"></Skeleton>
            <Skeleton class="w-full h-4"></Skeleton>
            <Skeleton class="w-full h-4"></Skeleton>
          </div>
      </article>
</template>
