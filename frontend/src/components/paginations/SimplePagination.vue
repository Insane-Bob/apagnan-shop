<script setup lang="ts">
import Button from '@components/ui/button/Button.vue'
import { computed } from 'vue'

const props = defineProps<{
    pagination?: {
        nextPage: () => void
        prevPage: () => void
        goToPage: (page: number) => void
        total: number
        currentPage: number
        limit: number
    }
    page?: object
}>()


const pagination = computed(() => {
    return props.pagination
})

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
        <button v-for="i in [2,1]" :key="i">
            <span v-if="(pagination.currentPage - i) <= pagination.total && pagination.currentPage - i >= 1" @click="pagination.goToPage(pagination.currentPage - i)">{{ pagination.currentPage - i }}</span>
        </button>
        <button class="bg-primary text-white h-6 w-6 rounded-sm">
            {{ pagination.currentPage }}
        </button>
        <button v-for="i in 2" :key="i">
            <span v-if="(pagination.currentPage + i) <= pagination.total" @click="pagination.goToPage(pagination.currentPage + i)">{{ pagination.currentPage + i }}</span>
        </button>
        <button
            @click="pagination.nextPage"
            :class="{
                'text-gray-300 cursor-not-allowed':
                    pagination.currentPage >=
                    pagination.total,
            }"
        >
            <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
    </div>
</template>
