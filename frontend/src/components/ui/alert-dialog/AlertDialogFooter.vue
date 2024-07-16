<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-col-reverse flex-wrap sm:flex-row justify-end sm:justify-center sm:gap-x-3 sm:gap-y-2',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
