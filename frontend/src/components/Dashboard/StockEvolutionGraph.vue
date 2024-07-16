<script setup lang="ts">
import { apiClient } from '@/lib/apiClient'
import { computed, defineProps, onMounted, ref, watch } from 'vue'
import BarChart from '@components/ui/chart-bar/BarChart.vue'
import CardContent from '@components/ui/card/CardContent.vue'
import CardHeader from '@components/ui/card/CardHeader.vue'
import CardDescription from '@components/ui/card/CardDescription.vue'
import CardTitle from '@components/ui/card/CardTitle.vue'

const props = defineProps({
    dateRange: {
        type: Object,
        required: true,
    },
    interval: {
        type: String,
        default: 'day',
    },
})

const dateRange = computed(() => props.dateRange)
const interval = computed(() => props.interval)

const data = ref(null)
async function fetch() {
    let search = new URLSearchParams({
        start: new Date(dateRange.value.start).toISOString(),
        end: new Date(dateRange.value.end).toISOString(),
        interval: interval.value,
        productId: 1,
    }).toString()
    const { data: apiData } = await apiClient.get('/stats/stock?' + search)
    data.value = apiData
}

onMounted(() => {
    fetch()
})

watch(
    [dateRange, interval],
    () => {
        fetch()
    },
    { deep: true },
)
</script>

<template>
    <div class="flex">
        <CardHeader class="">
            <CardTitle>Stock</CardTitle>
            <CardDescription>Evolution du stock</CardDescription>
        </CardHeader>
    </div>
    <CardContent class="pl-2">
        <BarChart
            class="h-[320px]"
            :data="data"
            index="label"
            :categories="['count']"
            :rounded-corners="4"
        ></BarChart>
    </CardContent>
</template>

<style scoped></style>
