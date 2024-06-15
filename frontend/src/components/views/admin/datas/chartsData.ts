import { categories } from '@vueuse/core/metadata.cjs'
import { data as chartlineData } from './chartline-temp'
import { data as donutData } from './pie-temp'

export const charts = [
    {
        type: 'line',
        data: chartlineData,
        index: 'year',
        style: { col: 'col-span-8', row: 'row-span-2' },
    },
    {
        type: 'donut',
        data: donutData,
        index: 'name',
        categorie: 'total',
        style: { col: 'col-span-4', row: 'row-span-2' },
    },
]
