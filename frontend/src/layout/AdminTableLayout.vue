<script setup lang="ts"></script>

<template>
    <div class="flex flex-col mx-6">
        <div class="flex justify-between items-center mb-3">
            <div class="flex gap-4 items-center">
                <slot name="filters"></slot>
            </div>
            <slot name="actions"></slot>
        </div>
        <slot></slot>
    </div>
</template>

<style scoped></style>
