<script setup lang="ts">
import { defineProps } from 'vue'

defineProps(['columns', 'multiActionLength'])
</script>

<template>
    <td
        :class="{
            'text-right': columns?.position === 'right',
            'text-center': columns?.position === 'center',
            'whitespace-nowrap': !columns?.maxWidth,
            'pl-4': multiActionLength ? multiActionLength === 0 : true

        }"
        class="px-6 py-3 font-medium text-gray-900"
        :style="`max-width: ${columns?.maxWidth} ;`"
    >
        <slot></slot>
    </td>
</template>
