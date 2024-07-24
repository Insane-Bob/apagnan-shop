<script setup lang="ts">
import Button from '@components/ui/button/Button.vue'
import { computed } from 'vue'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@components/ui/select'

const props = defineProps<{
    pagination?: {
        setLimit: () => void
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
    <div v-if="pagination" class="flex gap-3 justify-end items-center">
        <div class="flex items-center space-x-2">
            <p class="font-medium">Lignes par page</p>
            <Select
                :model-value="pagination.limit"
                @update:model-value="pagination.setLimit"
            >
                <SelectTrigger class="w-[70px]">
                    <SelectValue placeholder="Par page" />
                </SelectTrigger>
                <SelectContent side="top">
                    <SelectItem
                        v-for="pageSize in [10, 20, 30, 40, 50]"
                        :key="pageSize"
                        :value="pageSize"
                    >
                        {{ pageSize }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
        <span class="mx-6">
            {{ pagination.currentPage }} sur {{ pagination.total }}
        </span>
        <Button
            size="icon"
            variant="outlineDashboard"
            class="ml-0"
            @click="() => pagination.goToPage(1)"
        >
            <ion-icon name="chevron-back-outline" />
            <ion-icon name="chevron-back-outline" />
        </Button>
        <Button
            size="icon"
            variant="outlineDashboard"
            class="ml-0"
            @click="pagination.prevPage"
        >
            <ion-icon name="chevron-back-outline" />
        </Button>
        <Button
            size="icon"
            variant="outlineDashboard"
            class="ml-0"
            @click="pagination.nextPage"
        >
            <ion-icon name="chevron-forward-outline" />
        </Button>
        <Button
            size="icon"
            variant="outlineDashboard"
            class="ml-0"
            @click="() => pagination.goToPage(pagination.total)"
        >
            <ion-icon name="chevron-forward-outline" />
            <ion-icon name="chevron-forward-outline" />
        </Button>
    </div>
</template>
