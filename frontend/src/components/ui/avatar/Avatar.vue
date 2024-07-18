<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { AvatarRoot } from 'radix-vue'
import { type AvatarVariants, avatarVariant } from '.'
import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<{
  class?: HTMLAttributes['class']
  size?: AvatarVariants['size']
  shape?: AvatarVariants['shape']
  color?: AvatarVariants['color']
}>(), {
  size: 'sm',
  shape: 'circle',
})
</script>

<template>
  <AvatarRoot :class="cn(avatarVariant({ size, shape, color }), props.class)">
    <slot />
  </AvatarRoot>
</template>
