<script setup lang="ts">
import { DialogTrigger } from '@/components/ui/dialog'
import SimplePagination from '@components/paginations/SimplePagination.vue'
import HeaderTable from '@components/tables/utils/HeaderTable.vue'
import CellTable from '@components/tables/utils/CellTable.vue'
import Button from '@components/ui/button/Button.vue'
import { computed, reactive, ref } from 'vue'
import { TableColumns, TableActions, Page } from '@types'
const isAllSelected = ref(false)

const emit = defineEmits([
    'emitNextPage',
    'emitPreviousPage',
    'updateRows',
    'updateSearch',
    'multiAction',
])

const props = defineProps<{
    columns: TableColumns[]
    rows: any[]
    actions?: TableActions[]
    multiActions?: {
        label: string
        icon?: string
        class?: string
        action: (rows: any[]) => void
    }[]
    page?: Page
    pagination?: object
    search?: {
        key: string
        value: string
    }[]
    sorting?: {
        key: string
        direction: string
        changeSort: (key: string) => void
    }
}>()

const rows = computed(() => {
    return props.rows
})

function onSort(key: string) {
    if (!props.sorting) return
    props.sorting.changeSort(key)
}

function onSelectAll() {
    const allSelected = rows.value.every((row) => row.selected)
    rows.value.forEach((selectedRows) => (selectedRows.selected = !allSelected))
    isAllSelected.value = !allSelected

    emit('updateRows', rows.value)
}

function onSelect(id: number) {
    const row = rows.value.find((row) => row.id === id)
    emit('updateRows', rows.value)
    if (row) {
        row.selected = !row.selected
        isAllSelected.value = rows.value.every((row) => row.selected)
    }
}

function onSearchIn(event: any, key: string) {
    emit('updateSearch', { key, value: event.target.value })
}

function onExecMultiAction(callBack: (item: any) => void) {
    emit('multiAction', callBack)
}
</script>

<template>
    <div class="relative">
        <div
            v-if="
                props.multiActions &&
                props.multiActions.length > 0 &&
                rows.some((row) => row.selected)
            "
            class="absolute top-0 flex gap-x-2 w-full justify-end duration-150"
        >
            <Button
                v-for="action in multiActions"
                :key="'multi-' + action.label"
                :class="action.class"
                @click="onExecMultiAction(action.action)"
            >
                <ion-icon :name="action.icon"></ion-icon>
                <span>{{ action.label }}</span>
            </Button>
        </div>

        <div class="border rounded-md overflow-hidden">
            <table class="w-full text-sm text-left text-gray-500">
                <thead
                    class="text-xs text-gray-700 uppercase hover:bg-muted/50 border-b bg-gray-50"
                >
                    <tr>
                        <HeaderTable
                            class="pl-4"
                            v-if="
                                props.multiActions &&
                                props.multiActions.length > 0
                            "
                        >
                            <ion-icon
                                @click="onSelectAll()"
                                :name="
                                    isAllSelected
                                        ? 'checkbox'
                                        : 'square-outline'
                                "
                                class="text-lg cursor-pointer"
                            ></ion-icon>
                        </HeaderTable>

                        <HeaderTable
                            v-for="column in props.columns"
                            :key="column.key"
                            :columns="column"
                            :multiActionLength="props.multiActions?.length"
                            :position="column.position"
                            @click="
                                column.sorting ? onSort(column.key) : () => {}
                            "
                        >
                            <slot :name="column.key" class="fiont">{{
                                column.label
                            }}</slot>
                            <ion-icon
                                v-if="
                                    column.sorting &&
                                    sorting?.key === column.key
                                "
                                class="cursor-pointer text-sm"
                                :name="
                                    sorting?.key == column.key &&
                                    sorting?.direction === 'asc'
                                        ? 'arrow-up'
                                        : 'arrow-down'
                                "
                            ></ion-icon>
                            <ion-icon
                                v-else-if="column.sorting"
                                class="cursor-pointer text-sm opacity-0 hover:opacity-100"
                                name="chevron-expand"
                            />
                        </HeaderTable>

                        <HeaderTable
                            v-if="props.actions && props.actions.length > 0"
                            position="right"
                        >
                            Actions
                        </HeaderTable>
                    </tr>
                    <tr v-if="search && search.length > 0" class="bg-gray-100">
                        <CellTable
                            v-if="
                                props.multiActions &&
                                props.multiActions?.length > 0
                            "
                            class="pl-4 py-2"
                        ></CellTable>
                        <td
                            v-for="column in props.columns"
                            :key="'search-' + column.key"
                            class="px-5 relative py-2"
                        >
                            <input
                                @keyup="onSearchIn($event, column.key)"
                                v-if="search?.some((s) => s.key === column.key)"
                                type="text"
                                class="w-full p-1 border border-gray-300 rounded-md pr-0 md:pr-8"
                                :placeholder="'Recherche dans ' + column.label"
                            />
                            <ion-icon
                                v-if="search?.some((s) => s.key === column.key)"
                                class="absolute top-1/2 right-4 -translate-y-1/2 -translate-x-full z-20 hidden md:block"
                                name="search-outline"
                            ></ion-icon>
                        </td>
                        <CellTable
                            v-if="props.actions && props.actions.length > 0"
                            class="py-2"
                        ></CellTable>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(row, index) in props.page
                            ? rows.slice(
                                  (props.page.current - 1) * props.page.perPage,
                                  props.page.current * props.page.perPage,
                              )
                            : rows"
                        :key="index"
                        class="bg-white border-b hover:bg-muted/50"
                    >
                        <CellTable
                            v-if="
                                props.multiActions &&
                                props.multiActions.length > 0
                            "
                            class="pl-4"
                            ><ion-icon
                                @click="onSelect(row.id)"
                                :name="
                                    row.selected ? 'checkbox' : 'square-outline'
                                "
                                class="text-lg cursor-pointer"
                            ></ion-icon
                        ></CellTable>
                        <CellTable
                            v-for="column in props.columns"
                            :key="column.key"
                            :multiActionLength="props.multiActions?.length"
                            :columns="column"
                        >
                            <slot :name="'row:' + column.key" :row="row">{{
                                column.toDisplay
                                    ? column.toDisplay(row[column.key])
                                    : row[column.key]
                            }}</slot>
                        </CellTable>

                        <CellTable v-if="props.actions && props.actions.length">
                            <div class="flex justify-end space-x-2">
                                <div
                                    v-for="action in props.actions"
                                    :key="action.label"
                                    :class="{
                                        hidden: action.condition
                                            ? !action.condition(row)
                                            : false,
                                    }"
                                >
                                    <div
                                        v-if="
                                            !action.trigger ||
                                            action.trigger === false
                                        "
                                        class="relative group transition delay-1000"
                                    >
                                        <ion-icon
                                            @click.stop="action.action(row)"
                                            class="cursor-pointer hover:scale-105 duration-200 text-xl"
                                            :class="action.class"
                                            :name="action.icon"
                                        ></ion-icon>
                                        <span
                                            class="group-hover:block hidden text-white bg-black duration-100 absolute top-0 -translate-y-full -translate-x-full z-30 px-1 py-1 rounded-sm cursor-default select-none"
                                            >{{ action.label }}</span
                                        >
                                    </div>
                                    <DialogTrigger
                                        v-else
                                        class="relative group transition delay-1000"
                                    >
                                        <ion-icon
                                            @click="action.action(row)"
                                            class="cursor-pointer hover:scale-105 duration-200 text-xl"
                                            :class="action.class"
                                            :name="action.icon"
                                        ></ion-icon>
                                        <span
                                            class="group-hover:block hidden text-white bg-black duration-100 absolute top-0 -translate-y-full -translate-x-full z-30 px-1 py-1 rounded-sm cursor-default select-none"
                                            >{{ action.label }}</span
                                        >
                                    </DialogTrigger>
                                </div>
                            </div>
                        </CellTable>
                    </tr>
                    <tr v-if="rows.length == 0">
                        <td
                            :colspan="props.columns.length + 1"
                            class="text-center py-4 bg-white"
                        >
                            Aucune donnée
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <SimplePagination
            v-if="props.pagination"
            :pagination="props.pagination"
        >
        </SimplePagination>
    </div>
</template>

<style scoped>
[name='checkbox'] {
    color: hsl(var(--primary-accent));
}
</style>
