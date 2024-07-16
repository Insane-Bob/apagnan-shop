<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { AlertDialogTitle, type AlertDialogTitleProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<AlertDialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <AlertDialogTitle
    v-bind="delegatedProps"
    :class="cn('flex flex-wrap justify-center md:justify-between items-center text-lg font-semibold text-primary', props.class)"
  >
    <slot />
  </AlertDialogTitle>
</template>
