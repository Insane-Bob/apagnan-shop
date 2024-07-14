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
    const { data: apiData } = await apiClient.get(
        '/stats/orders-taken?' + search,
    )
    data.value = apiData
}

onMounted(() => {
    fetch()
})

watch(
    [interval, , dateRange],
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
                <CardTitle>Commandes</CardTitle>
                <CardDescription>Evolution prise de commande</CardDescription>
            </CardHeader>
        </div>
        <CardContent class="pl-2 flex-1">
            <AreaChart
                class="h-[320px]"
                :data="data"
                index="label"
                :categories="['count']"
            ></AreaChart>
        </CardContent>
    </div>
</template>

<style scoped></style>
