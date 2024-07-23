<script setup lang="ts">
import { ApiClient } from '@/lib/apiClient'
import { computed, defineProps, onMounted, ref, watch } from 'vue'
import BarChart from '@components/ui/chart-bar/BarChart.vue'
import CardContent from '@components/ui/card/CardContent.vue'
import CardHeader from '@components/ui/card/CardHeader.vue'
import CardDescription from '@components/ui/card/CardDescription.vue'
import CardTitle from '@components/ui/card/CardTitle.vue'
import {useFetch} from "@/composables/useFetch";
import Select from "@components/ui/select/Select.vue";
import SelectItem from "@components/ui/select/SelectItem.vue";
import SelectContent from "@components/ui/select/SelectContent.vue";
import SelectTrigger from "@components/ui/select/SelectTrigger.vue";
import SelectValue from "@components/ui/select/SelectValue.vue";

const apiClient = new ApiClient()

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

const products = ref([])
const selectedProductId = ref(null)
const url = computed(()=> '/products?attributes=name,id')
const fetchProduct = useFetch(url,null, (data)=>{
    products.value = data.data
    selectedProductId.value = data.data[0].id
})

async function fetch() {
    let search = new URLSearchParams({
        start: new Date(dateRange.value.start).toISOString(),
        end: new Date(dateRange.value.end).toISOString(),
        interval: interval.value,
        productId: selectedProductId.value,
    }).toString()
    const { data: apiData } = await apiClient.get('/stats/stock?' + search)
    data.value = apiData.map((item) => ({
        label: item.label,
        count: item.count,
    }))
}

onMounted(fetch)
onMounted(fetchProduct.get)
watch(selectedProductId,fetch)

watch(
    [dateRange, interval],
    fetch,
    { deep: true },
)
</script>

<template>
    <div class="flex">
        <CardHeader class="w-full">
          <div class="flex justify-between">
            <div>
              <CardTitle>Stock</CardTitle>
              <CardDescription>Evolution du stock</CardDescription>
            </div>

            <div class="ml-auto">
              <Select v-model="selectedProductId">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem :value="product.id" :key="product.id" v-for="product in products">
                    {{product.name}}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>


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
