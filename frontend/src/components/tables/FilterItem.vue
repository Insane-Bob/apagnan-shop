<script setup lang="ts">
import { CommandItem } from '@components/ui/command'
import { computed, inject } from 'vue'
const props = defineProps<{
    value: string
    label: string
}>()

const handleFilterSelected = inject('handleFilterSelected')
const filterSelected = inject('filterSelected')

const isSelected = computed(() => {
    return filterSelected.some((v) => v.value == props.value)
})
</script>

<template>
    <CommandItem
        :value="props.label"
        @select="() => handleFilterSelected(props)"
    >
        <div class="flex items-center gap-2">
            <ion-icon
                class="text-xl"
                :name="isSelected ? 'checkbox' : 'square-outline'"
            ></ion-icon>
            {{ props.label }}
        </div>
    </CommandItem>
</template>

<style scoped></style>
