<script setup lang="ts">
import { apiClient } from '@/lib/apiClient'
import { computed, onMounted, ref, watch } from 'vue'
import CardHeader from '@components/ui/card/CardHeader.vue'
import CardDescription from '@components/ui/card/CardDescription.vue'
import CardTitle from '@components/ui/card/CardTitle.vue'
import AreaChart from '@components/ui/chart-area/AreaChart.vue'

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
    }).toString()
    const { data: apiData } = await apiClient.get('/stats/incomes?' + search)
    data.value = apiData
}

const formatedData = computed(() => {
    if (!data.value) return []
    return data.value.map((item: any) => ({
        label: item.label,
        total: item.count,
    }))
})

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
    <div class="flex flex-col">
        <div class="flex">
            <CardHeader class="">
                <CardTitle>Revenus</CardTitle>
                <CardDescription>Evolution des révenus</CardDescription>
            </CardHeader>
        </div>
        <CardContent class="pl-2 flex-1">
            <AreaChart
                class="h-[320px]"
                :data="formatedData"
                index="label"
                :categories="['total']"
            ></AreaChart>
        </CardContent>
    </div>
</template>

<style scoped></style>
