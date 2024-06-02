<script setup lang="ts">
import Skeleton from '@components/ui/skeleton/Skeleton.vue';
</script>

<template>

<article class="flex-col w-[366px]">
        <div class="w-[366px] h-[471px] mb-2">
            <Skeleton class="w-full h-full object-cover" />
        </div>
        <div class="flex justify-between mb-2 gap-y-2">
          <div class="flex flex-col w-full gap-y-2">
            <Skeleton class="h-6 w-full" />
            <Skeleton class="h-6  w-full" />
          </div>
        </div>
        <Skeleton class="h-8 w-full" />
      </article>
</template>