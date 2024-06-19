<script setup lang="ts">
import SimplePagination from '@components/paginations/SimplePagination.vue';
import HeaderTable from '@components/tables/utils/HeaderTable.vue';
import CellTable from '@components/tables/utils/CellTable.vue';
import Button from '@components/ui/button/Button.vue';
import { computed, reactive, ref } from 'vue';
import { TableColumns, TableActions, Page } from '@types';
const isAllSelected = ref(false);

const emit = defineEmits(['emitNextPage', 'emitPreviousPage', 'updateRows', 'updateSearch', 'multiAction',]);

const props = defineProps<{
    columns: TableColumns[];
    rows: any[]
    actions?: TableActions[]
    multiActions? : 
    {
        label: string;
        icon?: string;
        class?: string;
        action: (rows: any[]) => void;
    }[]
    page?: Page
    search?: 
    {
        key: string;
        value: string;
    }[]
}>();


const sorting = reactive({
    key: '',
    direction: ''
});

const rows = computed(
    () => {
    return props.rows
}
);


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

    rows.value.sort((a, b) => {
        if (sorting.direction === 'asc') {
            return a[key] > b[key] ? 1 : -1;
        } else {
            return a[key] < b[key] ? 1 : -1;
        }
    });
}

function sortDate(key: string) {
    rows.value.sort((a, b) => {
        if (sorting.direction === 'asc') {
            return new Date(a[key]) > new Date(b[key]) ? 1 : -1;
        } else {
            return new Date(a[key]) < new Date(b[key]) ? 1 : -1;
        }
    });
}

function onSelectAll() {
    const allSelected = rows.value.every(row => row.selected);
    rows.value.forEach(selectedRows => selectedRows.selected = !allSelected);
    isAllSelected.value = !allSelected;

    emit('updateRows', rows.value);

}

function onSelect(id: number) {
    const row = rows.value.find(row => row.id === id);
    emit('updateRows', rows.value);
    if (row) {
        row.selected = !row.selected;
        isAllSelected.value = rows.value.every(row => row.selected);
    }
}



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

function onSearchIn(event: any,key: string) {
    emit('updateSearch', {key, value: event.target.value});
}

function onExecMultiAction(callBack: (item: any) => void){
    emit('multiAction', callBack)
}


</script>

<template>
    <div class="relative py-12">
        <div v-if="props.multiActions && props.multiActions.length > 0 && rows.some(row => row.selected)" class="absolute top-0 flex gap-x-2 w-full justify-end duration-150">
            <Button v-for="action in multiActions" :key="'multi-' + action.label" :class="action.class" @click="onExecMultiAction(action.action)">
                <ion-icon :name="action.icon"></ion-icon>
                <span>{{ action.label }}</span>
            </Button>
        </div>

        <table class="w-full text-sm text-left text-gray-500 rounded-md">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <HeaderTable class="pl-4" v-if="props.multiActions && props.multiActions.length > 0">
                        <ion-icon @click="onSelectAll()" :name="isAllSelected?'checkbox':'square-outline'" class="text-lg cursor-pointer"></ion-icon>
                    </HeaderTable>

                    <HeaderTable v-for="column in props.columns" :key="column.key" :columns="column" :multiActionLength="props.multiActions?.length" :position="column.position">
                        <slot :name="column.key">{{ column.label }}</slot>
                        <ion-icon v-if="column.sorting" @click="onSort(column.key)" class=" cursor-pointer" name="chevron-expand-outline"></ion-icon>
                    </HeaderTable>

                    <HeaderTable v-if="props.actions?.length > 0" class="text-right">Actions</HeaderTable>
                </tr>
                <tr v-if="search && search.length > 0" class="bg-gray-100">
                    <CellTable v-if="props.multiActions && props.multiActions?.length > 0" class="pl-4 py-2"></CellTable>
                    <td  v-for="column in props.columns" :key="'search-'+column.key" class="px-5 relative  py-2">
                        <input @keyup="onSearchIn($event, column.key)" v-if="search?.some(s => s.key === column.key)"  type="text" class="w-full p-1 border border-gray-300 rounded-md pr-0 md:pr-8" :placeholder="'Recherche dans '+ column.label ">
                        <ion-icon v-if="search?.some(s => s.key === column.key)" class="absolute top-1/2 right-4 -translate-y-1/2 -translate-x-full z-20 hidden md:block" name="search-outline"></ion-icon>
                    </td>
                    <CellTable v-if="props.actions?.length > 0" class=" py-2"></CellTable>
                </tr>
            </thead>
            <tbody>
                <tr v-for="row in props.page?rows.slice((props.page.current-1)*props.page.perPage, props.page.current*props.page.perPage):rows" :key="row.id" class="bg-white border-b even:bg-gray-50 odd:bg-white">
                    <CellTable v-if="props.multiActions && props.multiActions.length > 0" class="pl-4"><ion-icon @click="onSelect(row.id)" :name="row.selected ? 'checkbox' : 'square-outline'" class="text-lg  cursor-pointer"></ion-icon></CellTable>
                    <CellTable v-for="column in props.columns" :key="column.key" :multiActionLength="props.multiActions?.length" :columns="column">
                        <slot :name="column.key" :row="row">{{ column.toDisplay? column.toDisplay(row[column.key]) : row[column.key] }}</slot>
                        
                    </CellTable>

                    <CellTable v-if="props.actions">
                        <div class="flex justify-end space-x-2 ">
                            <div v-for="action in props.actions" :key="action.label" class="relative group transition delay-1000" :class="{'hidden': action.condition? !action.condition(row): false}" @click="action.action(row)">
                                <ion-icon  @click="action.action(row)" class="cursor-pointer hover:scale-105 duration-200 text-xl"  :class="action.class"  :name="action.icon"></ion-icon>
                                <span class="group-hover:block hidden text-white bg-black duration-100 absolute top-0 -translate-y-full -translate-x-full z-30 px-1 py-1 rounded-sm cursor-default select-none">{{ action.label }}</span>
                            </div>
                        </div>
                    </CellTable>
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