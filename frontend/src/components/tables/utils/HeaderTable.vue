<script setup lang="ts">
import { defineProps } from 'vue'

defineProps(['columns', 'multiActionLength', 'position'])
</script>

<template>
    <th
        :class="{
            'pl-4': multiActionLength ? multiActionLength === 0 : true,
        }"
        class="px-6 py-3"
    >
        <div
            :class="{
                'justify-end': position === 'right',
                'justify-center': position === 'center',
            }"
            class="flex items-center gap-2 text-gray-500 font-medium"
        >
            <slot></slot>
        </div>
    </th>
</template>
