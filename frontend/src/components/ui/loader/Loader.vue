<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps(['loading', 'waitFor', 'size'])

const _loading = computed(() => props.loading || !Boolean(props.waitFor))

const _size = computed(() => {
    return props.size || 10
})
</script>

<template>
    <div v-if="_loading" class="w-full flex items-center justify-center py-6">
        <div :class="['w-' + _size, 'h-' + _size, 'relative']">
            <div
                class="w-full h-full border-4 border-accent-200 rounded-full animate-spin"
            ></div>
            <div
                class="w-full h-full border-4 border-b-0 border-l-0 border-primary rounded-[100px] animate-spin absolute top-0 left-0"
            ></div>
        </div>
    </div>
    <div v-else><slot></slot></div>
</template>

<style scoped></style>
