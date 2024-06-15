<script setup lang="ts">
import { LineChart } from '@/components/ui/chart-line'
import { DonutChart } from '@/components/ui/chart-donut'
import {data  as chartlineData, data} from './datas/chartline-temp'
import { data as pieData } from './datas/pie-temp'
import ChartForm from '@components/dialogs/ChartForm.vue'

import {
  Dialog,
  DialogTrigger,
  DialogContent
} from '@/components/ui/dialog'


import {charts as chartsTemp} from './datas/chartsData'
import { ref, reactive } from 'vue'

const charts = reactive({charts:chartsTemp})
const open = ref(false)

 const setCategories = (chart: any):any => {
    const categories: string[] = []
    for (const key in chart.data[0]){
        if(key !== chart.index){
            categories.push(key)
        }
    }
    return categories
}

const submit = (event: any) => {
    const newChart = {
        type: event.chart,
        index: event.index,
        data: event.chart === 'line' ? chartlineData: pieData,
        style: event.chart === 'line' ? {col: 'col-span-8', row: 'row-span-2'}: {col: 'col-span-4', row: 'row-span-2'},
    }

    charts.charts.push(newChart as any)
    open.value = false
}

const onDialogTrigger = () => {
    open.value = !open.value
}



</script>

<template>
    <Dialog :open="open">
        <div class="grid grid-cols-12 gap-8 m-12">

            <div v-for="(chart, index) in charts.charts" :key="index" class="flex justify-center items-center min-h-40 rounded-sm border-primary border-2 p-6" :class="chart.style.col + ' ' + chart.style.col">
                <LineChart v-if="chart.type == 'line'"
                    :colors="['red', 'green']"
                    :index="chart.index || 'year'"
                    :categories="setCategories(chart)"
                    :y-formatter="(tick, i) => {
                        return typeof tick === 'number'
                        ? `${new Intl.NumberFormat('fr').format(tick).toString()}K €`
                        : ''
                    }"
                    :data="chart.data as any"
                />

                <DonutChart  v-if="chart.type == 'donut' || chart.type == 'pie' "
                    :index="chart.index /*@ts-ignore*/"
                    :category="chart?.categorie"
                    :show-legend="true"
                    :type="chart.type"
                    :colors="['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple']"
                    :data="chart.data"
                /> 

            </div>

            <DialogTrigger  @click="onDialogTrigger()" class="col-span-4 row-span-2 flex justify-center items-center rounded-sm border-primary border-2 p-6 group cursor-pointer">
                <ion-icon class="text-7xl text-primary group-hover:scale-110 duration-300" name="add-circle-outline"></ion-icon>
            </DialogTrigger>
            <div class="w-full aspect-square min-h-40"></div>
        </div>

        <DialogContent class="sm:max-w-[425px] xl:max-w-[825px]">
            <ChartForm @submit="submit($event)" />
        </DialogContent>
    </Dialog>
</template>