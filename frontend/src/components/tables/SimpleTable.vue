<script setup lang="ts">

import { reactive } from 'vue';

const props = defineProps<{
    columns: 
    {
        label: string;
        key: string;
        sorting?: boolean;
        position?: "left" | "center" | "right" ;
        toDisplay?: (value: any) => string;
        sortingType?:  'string' | 'number' | 'date' | 'boolean' | 'custom' | 'none';
    }[];
    rows: any[]
    page?: 
    {
        current: number;
        total: number;
        perPage: number;
    
    }
}>();

const sorting = reactive({
    key: '',
    direction: ''
});

const rows = reactive(props.rows);

function onSort(key: string) {
    if (sorting.key === key) {
        sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    } else {
        sorting.key = key;
        sorting.direction = 'asc';
    }

    if (props.columns.find(column => column.key === key)?.sortingType === 'date') {
        sortDate(key);
        return
    }

    rows.sort((a, b) => {
        if (sorting.direction === 'asc') {
            return a[key] > b[key] ? 1 : -1;
        } else {
            return a[key] < b[key] ? 1 : -1;
        }
    });
}

function sortDate(key: string) {
    rows.sort((a, b) => {
        if (sorting.direction === 'asc') {
            return new Date(a[key]) > new Date(b[key]) ? 1 : -1;
        } else {
            return new Date(a[key]) < new Date(b[key]) ? 1 : -1;
        }
    });
}

const emit = defineEmits(['emitNextPage', 'emitPreviousPage'])

function onPreviousPage() {
    if(!props.page) return
    if(props.page.current === 1) return

    emit('emitPreviousPage')
}

function onNextPage() {
    if(!props.page) return
    if(props.page.current*props.page.perPage >= props.page.total) return
    
    emit('emitNextPage')
}

</script>

<template>
    <table class="w-full text-sm text-left text-gray-500 rounded-md">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th v-for="column in props.columns" :key="column.key" :class="{'text-right':column.position === 'right', 'text-center':column.position === 'center'}" class="px-6 py-3">
                    {{ column.label }}
                    <ion-icon v-if="column.sorting" @click="onSort(column.key)" class=" cursor-pointer" name="chevron-expand-outline"></ion-icon>
                </th>
            </tr>
        </thead>
           <tbody>
            
            <tr v-for="row in props.page?rows.slice((props.page.current-1)*props.page.perPage, props.page.current*props.page.perPage):rows" :key="row.id" class="bg-white border-b even:bg-gray-50 odd:bg-white">
                <td v-for="column in props.columns" :key="column.key" :class="{'text-right':column.position === 'right', 'text-center':column.position === 'center'}" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {{ column.toDisplay? column.toDisplay(row[column.key]) : row[column.key] }}
                </td>
            </tr>
           </tbody>
    </table>
    <div v-if="props.page" class="text-sm w-full flex justify-center items-center gap-x-3 mt-2">
        <button @click="onPreviousPage()" :class="{'text-gray-300 cursor-not-allowed':props.page.current === 1}"><ion-icon name="chevron-back-outline"></ion-icon></button>
        <button v-if="props.page.current > 1" @click="onPreviousPage()">{{ props.page.current-1 }}</button>
        <button class="bg-primary text-white h-6 w-6 rounded-sm">{{ props.page.current }}</button>
        <button v-if="props.page.current < props.page.total/props.page.perPage" @click="onNextPage()">{{ props.page.current+1 }}</button>
        <button @click="onNextPage()" :class="{'text-gray-300 cursor-not-allowed':props.page.current*props.page.perPage >= props.page.total}"><ion-icon name="chevron-forward-outline" ></ion-icon></button>
    </div>
</template>