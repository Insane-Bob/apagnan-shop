<script setup lang="ts">
import SimplePagination from '@components/paginations/SimplePagination.vue';
import { reactive, ref } from 'vue';

const isAllSelected = ref(false);

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
    actions: 
    {
        label: string;
        icon: string;
        class?: string;
        action: (row: any) => void;
    }[]

    multiActions : 
    {
        label: string;
        icon?: string;
        class?: string;
        action: (rows: any[]) => void;
    }[]
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

const rows = reactive(props.rows.map(row => {
    return {
        ...row,
        selected: false
    }
}));

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

function onSelectAll() {
    const allSelected = rows.every(row => row.selected);
    rows.forEach(row => row.selected = !allSelected);
    isAllSelected.value = !allSelected;
}

function onSelect(id: number) {
    const row = rows.find(row => row.id === id);
    if (row) {
        row.selected = !row.selected;
        isAllSelected.value = rows.every(row => row.selected);
    }
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
    <div class="relative py-12">
        <div v-if="props.multiActions && props.multiActions.length > 0 && rows.some(row => row.selected)" class="absolute top-0 flex gap-x-2 w-full justify-end duration-150">
            <Button v-for="action in multiActions" :key="'multi-' + action.label" :class="action.class">
                <ion-icon :name="action.icon"></ion-icon>
                <span>{{ action.label }}</span>
            </Button>
        </div>

        <table class="w-full text-sm text-left text-gray-500 rounded-md">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th class="pl-4" v-if="props.multiActions?.length > 0"><ion-icon @click="onSelectAll()" :name="isAllSelected?'checkbox':'square-outline'" class="text-lg"></ion-icon></th>
                    <th v-for="column in props.columns" :key="column.key" :class="{'text-right':column.position === 'right', 'text-center':column.position === 'center', 'pl-4':props.multiActions?.length === 0 }" class="px-6 py-3">
                        {{ column.label }}
                        <ion-icon v-if="column.sorting" @click="onSort(column.key)" class=" cursor-pointer" name="chevron-expand-outline"></ion-icon>
                    </th>
                    <th v-if="props.actions?.length > 0">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in props.page?rows.slice((props.page.current-1)*props.page.perPage, props.page.current*props.page.perPage):rows" :key="row.id" class="bg-white border-b even:bg-gray-50 odd:bg-white">
                    <td v-if="props.multiActions && props.multiActions.length > 0" class="pl-4"><ion-icon @click="onSelect(row.id)" :name="row.selected ? 'checkbox' : 'square-outline'" class="text-lg"></ion-icon></td>
                    <td v-for="column in props.columns" :key="column.key" :class="{'text-right':column.position === 'right', 'text-center':column.position === 'center',  'pl-4':props.multiActions?.length === 0 }" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {{ column.toDisplay? column.toDisplay(row[column.key]) : row[column.key] }}
                    </td>

                    <td v-if="props.actions">
                        <div class="flex justify-center space-x-2 ">
                            <div v-for="action in props.actions" :key="action.label" class="relative group transition delay-1000">
                                <ion-icon  @click="action.action(row)" class="cursor-pointer hover:scale-105 duration-200 text-xl"  :class="action.class"  :name="action.icon"></ion-icon>
                                <span class="group-hover:block hidden text-white bg-black duration-100 absolute top-0 -translate-y-full -translate-x-full z-30 px-1 py-1 rounded-sm cursor-default select-none">{{ action.label }}</span>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <SimplePagination
            v-if="props.page"
            :page="props.page"
            @emitNextPage="onNextPage"
            @emitPreviousPage="onPreviousPage">
        </SimplePagination>

    </div>
    
</template>

<style scoped>

[name="checkbox"] {
    color: hsl(var(--primary-accent))
}

</style>