<script setup lang="ts">
import { CommandEmpty, CommandInput, CommandList } from '@components/ui/command'
import Button from '@components/ui/button/Button.vue'
import { computed, provide, reactive, Ref, ref, watch } from 'vue'
import Popover from '@components/ui/popover/Popover.vue'
import PopoverTrigger from '@components/ui/popover/PopoverTrigger.vue'
import PopoverContent from '@components/ui/popover/PopoverContent.vue'
import Command from '@components/ui/command/Command.vue'
import CommandItem from '@components/ui/command/CommandItem.vue'
import Separator from '@components/ui/separator/Separator.vue'
import Badge from '@components/ui/badge/Badge.vue'

const props = defineProps<{
    label: string
}>()

const isOpen = ref(false)

const filterSelected = reactive([])
const modelValue = defineModel()

const v = computed(() => modelValue.value)

//define TYPE
type FilterSelected = {
    value: string
    label: string
}

function handleFilterSelected(value: FilterSelected) {
    if (!filterSelected.find((v: FilterSelected) => v.value === value.value)) {
        filterSelected.push(value)
        modelValue.value.push(value.value)
    } else {
        let index = filterSelected.findIndex(
            (v: FilterSelected) => v.value === value.value,
        )
        filterSelected.splice(index, 1)
        modelValue.value = modelValue.value.filter(
            (item: string) => item !== value.value,
        )
    }
}

watch(v, (value) => {
    console.log(value.length == 0)
    // if (value.length === 0) {
    //     filterSelected.splice(0, filterSelected.length)
    // }
})

provide('handleFilterSelected', handleFilterSelected)
provide('filterSelected', filterSelected)
</script>

<template>
    <Popover v-model:open="isOpen">
        <PopoverTrigger as-child>
            <div>
                <Button
                    size="sm"
                    variant="outlineDashboard"
                    class="border-dashed"
                >
                    <ion-icon
                        name="add-circle-outline"
                        class="text-lg mr-2"
                    ></ion-icon>
                    {{ props.label }}
                    <Separator
                        orientation="vertical"
                        class="mx-2 h-4"
                        v-if="filterSelected.length"
                    />
                    <Badge
                        v-if="filterSelected.length > 2"
                        variant="secondary"
                        class="rounded-sm px-1 font-normal"
                    >
                        {{ filterSelected.length }} sélectionnés
                    </Badge>
                    <template v-else>
                        <Badge
                            v-for="filter in filterSelected"
                            :key="filter.value"
                            variant="secondary"
                            class="rounded-sm px-1 mx-1 font-normal"
                        >
                            {{ filter.label }}
                        </Badge>
                    </template>
                </Button>
            </div>
        </PopoverTrigger>
        <PopoverContent class="w-[200px] p-0">
            <Command>
                <CommandInput class="h-9" placeholder="Rechercher" />
                <CommandEmpty>Aucun filtre trouver.</CommandEmpty>
                <CommandList>
                    <slot></slot>
                </CommandList>
            </Command>
        </PopoverContent>
    </Popover>
</template>

<style scoped></style>
