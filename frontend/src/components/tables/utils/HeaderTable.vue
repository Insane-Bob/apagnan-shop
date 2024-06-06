<script setup lang="ts">
import { defineProps} from 'vue';

defineProps(['columns', 'multiActionLength', 'position'])

</script>

<template>
        <th :class="{'text-right':position === 'right', 'text-center':position === 'center', 'pl-4':multiActionLength?multiActionLength === 0:true }" class="px-6 py-3">
            <slot></slot>
        </th>
</template>