<script setup lang="ts">
import {cn} from "@/lib/utils";
import type {HTMLAttributes} from "vue";

const props = defineProps<{
  class:  HTMLAttributes['class']
}>()

</script>

<template>
    <section :class="cn('py-12', 'flex', 'flex-col', 'gap-12', props.class)">
        <slot></slot>
    </section>
</template>

<style scoped>

</style>