<script setup lang="ts">
import { LineChart } from '@/components/ui/chart-line'
import { DonutChart } from '@/components/ui/chart-donut'
import {data  as chartlineData} from './datas/chartline-temp'
import { data as pieData } from './datas/pie-temp'
import ChartForm from '@components/dialogs/ChartForm.vue'

import {
  Dialog,
  DialogTrigger,
  DialogContent
} from '@/components/ui/dialog'


</script>

<template>
    <Dialog>
        <div class="grid grid-cols-12 gap-8 m-12">

            <div class="col-span-8 row-span-2 min-h-40 rounded-sm border-primary border-2 p-6">
            <LineChart
                :colors="['red', 'green']"
                :data="chartlineData"
                index="year"
                :categories="['Export Growth Rate', 'Import Growth Rate']"
                :y-formatter="(tick, i) => {
                return typeof tick === 'number'
                    ? `$ ${new Intl.NumberFormat('us').format(tick).toString()}`
                    : ''
                }"
            />
            </div>

            <div class="col-span-4 row-span-2 flex justify-center items-center min-h-40 rounded-sm border-primary border-2 p-6">
                <DonutChart
                    index="name"
                    :category="'total'"
                    :show-legend="true"
                    :data="pieData"
                    :colors="['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'purple']"
                />

            </div>

            <DialogTrigger class="col-span-4 row-span-2 flex justify-center items-center rounded-sm border-primary border-2 p-6 group cursor-pointer">
                <ion-icon class="text-7xl text-primary group-hover:scale-110 duration-300" name="add-circle-outline"></ion-icon>
            </DialogTrigger>
            <div class="w-full aspect-square min-h-40"></div>
        </div>

        <DialogContent class="sm:max-w-[425px] xl:max-w-[825px]">
            <ChartForm />
        </DialogContent>
    </Dialog>
</template>