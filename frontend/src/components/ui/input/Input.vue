<script setup lang="ts">
import { cn } from '@/lib/utils'
import { useVModel } from '@vueuse/core'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
    defaultValue?: string | number
    modelValue?: string | number
    class?: HTMLAttributes['class']
    error?: string // Ajouter une propriété pour les erreurs
    type?: string
}>()

const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
})
</script>

<template>
    <div>
        <input
            v-model="modelValue"
            :type="props.type || 'text'"
            :class="
                cn(
                    'flex h-10 w-full rounded-none bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-within:border-primary-accent disabled:cursor-not-allowed disabled:opacity-50',
                    props.class,
                    { 'border-error': props.error },
                )
            "
        />

        <p v-if="props.error" class="text-red-500 text-xs mt-1">
            {{ props.error }}
        </p>
    </div>
</template>
