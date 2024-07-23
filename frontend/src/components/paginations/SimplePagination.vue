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
    <div
        v-if="pagination"
        class="ml-auto flex gap-3 justify-end items-center pt-6"
    >
        <div class="flex items-center space-x-2">
            <p class="font-medium">Ligne par page</p>
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
        <!--        <button-->
        <!--            @click="pagination.prevPage"-->
        <!--            :class="{-->
        <!--                'text-gray-300 cursor-not-allowed':-->
        <!--                    pagination.currentPage === 1,-->
        <!--            }"-->
        <!--        >-->
        <!--            <ion-icon name="chevron-back-outline"></ion-icon>-->
        <!--        </button>-->
        <!--        <button v-for="i in [2,1]" :key="i">-->
        <!--            <span v-if="(pagination.currentPage - i) <= pagination.total && pagination.currentPage - i >= 1" @click="pagination.goToPage(pagination.currentPage - i)">{{ pagination.currentPage - i }}</span>-->
        <!--        </button>-->
        <!--        <button class="bg-primary text-white h-6 w-6 rounded-sm">-->
        <!--            {{ pagination.currentPage }}-->
        <!--        </button>-->
        <!--        <button v-for="i in 2" :key="i">-->
        <!--            <span v-if="(pagination.currentPage + i) <= pagination.total" @click="pagination.goToPage(pagination.currentPage + i)">{{ pagination.currentPage + i }}</span>-->
        <!--        </button>-->
        <!--        <button-->
        <!--            @click="pagination.nextPage"-->
        <!--            :class="{-->
        <!--                'text-gray-300 cursor-not-allowed':-->
        <!--                    pagination.currentPage >=-->
        <!--                    pagination.total,-->
        <!--            }"-->
        <!--        >-->
        <!--            <ion-icon name="chevron-forward-outline"></ion-icon>-->
        <!--        </button>-->
    </div>
</template>
