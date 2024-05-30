<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div :class="cn('relative flex flex-col-reverse sm:flex-row bottom-0 sm:justify-end sm:gap-x-2', props.class)">
    <slot />
  </div>
</template>
