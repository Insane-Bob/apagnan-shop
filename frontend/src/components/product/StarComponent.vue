<script setup lang="ts">

defineProps<{
    value: number
}>()

</script>

<template>
    <div>
        <div class="flex gap-1">
            <ion-icon
                v-for="index in 5"
                :key="index"
                :name="index <= value ? 'star' : 'star-outline'"
                class="text-primary"
            ></ion-icon>
        </div>
    </div>
</template>