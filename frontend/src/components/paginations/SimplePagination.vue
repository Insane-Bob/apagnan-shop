<script setup lang="ts">
import Button from '@components/ui/button/Button.vue'
import { computed } from 'vue'

const props = defineProps<{
    pagination?: {
        nextPage: () => void
        prevPage: () => void
        totalPages: number
        currentPage: number
        limit: number
    }
    page?: object
}>()

const emit = defineEmits(['emitNextPage', 'emitPreviousPage'])

const pagination = computed(() => props.pagination)
function onNextPage() {
    emit('emitNextPage')
}

function onPreviousPage() {
    emit('emitPreviousPage')
}
</script>

<template>
    <div
        v-if="pagination"
        class="text-sm w-full flex justify-center items-center gap-x-3 mt-2"
    >
        <button
            @click="pagination.prevPage"
            :class="{
                'text-gray-300 cursor-not-allowed':
                    pagination.currentPage === 1,
            }"
        >
            <ion-icon name="chevron-back-outline"></ion-icon>
        </button>
        <button v-if="pagination.currentPage > 1" @click="pagination.prevPage">
            {{ pagination.currentPage - 1 }}
        </button>
        <button class="bg-primary text-white h-6 w-6 rounded-sm">
            {{ pagination.currentPage }}
        </button>
        <button
            v-if="
                pagination.currentPage <
                pagination.totalPages / pagination.limit
            "
            @click="onNextPage()"
        >
            {{ pagination.currentPage + 1 }}
        </button>
        <button
            @click="pagination.nextPage"
            :class="{
                'text-gray-300 cursor-not-allowed':
                    pagination.currentPage * pagination.limit >=
                    pagination.totalPages,
            }"
        >
            <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
    </div>
</template>
