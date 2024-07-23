<script setup lang="ts">
import { DialogTrigger } from '@/components/ui/dialog'
import ConfirmationModal from '@components/Modals/ConfirmationModal.vue'
import SimplePagination from '@components/paginations/SimplePagination.vue'
import HeaderTable from '@components/tables/utils/HeaderTable.vue'
import CellTable from '@components/tables/utils/CellTable.vue'
import { computed, reactive, ref } from 'vue'
import { TableColumns, TableActions, Page } from '@types'
import MultipleActionMenu from '@components/tables/MultipleActionMenu.vue'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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
        action: (ids: number[]) => void
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

const selected = defineModel('selected')
const isAllSelected = computed(() => {
    return rows.value
        .map((r) => r.id)
        .every((id) => selected.value.includes(id))
})
const hasMultipleActions = computed(() => {
    return props.multiActions && props.multiActions.length > 0
})
const isSelected = computed(() => {
    return (id: number) => {
        return selected.value.some((rowId) => rowId === id)
    }
})

const rows = computed(() => {
    return props.rows
})

function onSort(key: string) {
    if (!props.sorting) return
    props.sorting.changeSort(key)
}

function onSelectAll() {
    let idsOfPage = props.rows.map((row) => row.id)
    if (isAllSelected.value) {
        selected.value = selected.value.filter(
            (rowId) => !idsOfPage.includes(rowId),
        )
    } else {
        selected.value = [...selected.value, ...idsOfPage]
    }
}

function onSelect(id: number) {
    const isSelected = selected.value.some((rowId) => rowId === id)
    if (isSelected)
        selected.value = selected.value.filter((rowId) => rowId !== id)
    else selected.value.push(id)
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
        <div class="border rounded-md overflow-hidden">
            <table class="w-full text-sm text-left text-gray-500">
                <thead
                    class="text-xs text-gray-700 uppercase hover:bg-muted/50 border-b bg-gray-50"
                >
                    <tr>
                        <HeaderTable class="pl-4" v-if="hasMultipleActions">
                            <ion-icon
                                @click="onSelectAll()"
                                :name="
                                    isAllSelected
                                        ? 'checkbox'
                                        : 'square-outline'
                                "
                                class="text-lg cursor-pointer"
                            />
                        </HeaderTable>

                        <HeaderTable
                            v-for="column in props.columns"
                            :key="column.key"
                            :columns="column"
                            :position="column.position"
                            @click="
                                column.sorting ? onSort(column.key) : () => {}
                            "
                        >
                            <slot :name="column.key" class="fiont">
                                {{ column.label }}
                            </slot>
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
                            />
                            <ion-icon
                                v-else-if="column.sorting"
                                class="cursor-pointer text-sm opacity-50 hover:opacity-100"
                                name="chevron-expand"
                            />
                        </HeaderTable>

                        <HeaderTable
                            v-if="hasMultipleActions && selected.length"
                            position="right"
                        >
                            <MultipleActionMenu
                                :multiple-actions="multiActions"
                                :selected="selected"
                            />
                        </HeaderTable>
                        <HeaderTable
                            v-else-if="
                                props.actions && props.actions.length > 0
                            "
                            position="right"
                        >
                            Actions
                        </HeaderTable>
                    </tr>
                    <tr v-if="search && search.length > 0" class="bg-gray-100">
                        <CellTable
                            v-if="hasMultipleActions"
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
                            />
                        </td>
                        <CellTable
                            v-if="props.actions && props.actions.length > 0"
                            class="py-2"
                        ></CellTable>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="(row, index) in rows"
                        :key="index"
                        class="bg-white border-b hover:bg-muted/50"
                    >
                        <CellTable v-if="hasMultipleActions" class="pl-4"
                            ><ion-icon
                                @click="onSelect(row.id)"
                                :name="
                                    isSelected(row.id)
                                        ? 'checkbox'
                                        : 'square-outline'
                                "
                                class="text-lg cursor-pointer"
                        /></CellTable>
                        <CellTable
                            v-for="column in props.columns"
                            :key="column.key"
                            :multiActionLength="props.multiActions?.length"
                            :columns="column"
                        >
                            <slot :name="'row:' + column.key" :row="row">
                                <RouterLink
                                    v-if="column?.to"
                                    :to="column.to(row)"
                                    class="text-primary hover:text-primary/80"
                                >
                                    {{
                                        column.toDisplay
                                            ? column.toDisplay(row[column.key])
                                            : row[column.key]
                                    }}
                                </RouterLink>
                                <template v-else>
                                    {{
                                        column.toDisplay
                                            ? column.toDisplay(row[column.key])
                                            : row[column.key]
                                    }}
                                </template>
                            </slot>
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
                                    <div v-if="action.children && action.children.length">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger class="group relative">
                                                <ion-icon
                                                    class="cursor-pointer hover:scale-105 duration-200 text-xl"
                                                    :class="action.class"
                                                    :name="action.icon || 'ellipsis-vertical'"
                                                ></ion-icon>
                                                <span
                                                    class="group-hover:block hidden text-white bg-black duration-100 absolute top-0 -translate-y-full -translate-x-full z-30 px-1 py-1 rounded-sm cursor-default select-none"
                                                    >{{ action.label }}</span
                                                >
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem v-for="(a, index) in action.children" :key="index" :disabled="!a.condition(row)" @click="a.action(row)">
                                                    <ion-icon
                                                        class="mr-2"
                                                        :class="a.class"
                                                        :name="a.icon"
                                                    ></ion-icon>
                                                    {{ a.label }}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                    </div>
                                    <div v-else-if="
                                            (!action.trigger ||
                                            action.trigger === false)
                                            && !action.confirmation"
                                        class="relative group transition delay-1000">
                                        <ion-icon
                                            @click.stop="action.action(row)"
                                            class="cursor-pointer hover:scale-105 duration-200 text-xl"
                                            :class="action.class"
                                            :name="action.icon"
                                        />
                                        <span
                                            class="group-hover:block hidden text-white bg-black duration-100 absolute top-0 -translate-y-full -translate-x-full z-30 px-1 py-1 rounded-sm cursor-default select-none"
                                            >{{ action.label }}</span
                                        >
                                    </div>
                                    <DialogTrigger
                                        v-if="action.trigger || action.trigger === true"
                                        class="relative group transition delay-1000"
                                    >
                                        <ion-icon
                                            @click="action.action(row)"
                                            class="cursor-pointer hover:scale-105 duration-200 text-xl"
                                            :class="action.class"
                                            :name="action.icon"
                                        />
                                        <span
                                            class="group-hover:block hidden text-white bg-black duration-100 absolute top-0 -translate-y-full -translate-x-full z-30 px-1 py-1 rounded-sm cursor-default select-none"
                                            >{{ action.label }}</span
                                        >
                                    </DialogTrigger>

                                    <ConfirmationModal v-if="action.confirmation" 
                                    :confirm="action.action"
                                    :props="row"
                                    :title="action.confirmation.title || ''" 
                                    :message="action.confirmation.message || ''"
                                    :style-confirm="action.confirmation.styleConfirm || ''"
                                    :style-cancel="action.confirmation.styleCancel || ''"

                                    >
                                        <ion-icon
                                            class="cursor-pointer hover:scale-105 duration-200 text-xl"
                                            :class="action.class"
                                            :name="action.icon"
                                        ></ion-icon>
                                        <span
                                            class="group-hover:block hidden text-white bg-black duration-100 absolute top-0 -translate-y-full -translate-x-full z-30 px-1 py-1 rounded-sm cursor-default select-none"
                                            >{{ action.label }}</span
                                        >
                                    </ConfirmationModal>
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
