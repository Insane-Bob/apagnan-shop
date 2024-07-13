<script setup lang="ts">
import { SheetContent, SheetHeader, SheetTitle } from '@components/ui/sheet'
import Checkbox from '@components/ui/checkbox/Checkbox.vue'
import { defineModel, defineProps } from 'vue'
import Button from '@components/ui/button/Button.vue'
import Badge from '@components/ui/badge/Badge.vue'

const props = defineProps({
    hasUpdate: {
        type: Boolean,
        required: true,
    },
})
const emit = defineEmits(['save', 'update:hasUpdate'])
const value = defineModel()

function handleToggleSelect(checked, i) {
    value.value[i].active = checked
    emit('update:hasUpdate', true)
}
</script>

<template>
    <SheetContent class="flex flex-col">
        <SheetHeader>
            <SheetTitle class="uppercase tracking-wider">
                Configurer le tableau de bord
            </SheetTitle>
        </SheetHeader>
        <div class="flex-1">
            <div
                class="flex gap-4 items-center"
                v-for="(widget, i) in value"
                :key="'widget-' + i"
            >
                <Checkbox
                    :id="'widget-' + i"
                    @update:checked="
                        (checked) => handleToggleSelect(checked, i)
                    "
                    :checked="value[i].active"
                />
                <label :for="'widget-' + i"> {{ widget.name }} </label>
            </div>
        </div>
        <div class="relative">
            <Badge
                class="absolute right-[-6px] top-[-6px] p-0 w-[12px] h-[12px]"
                v-if="hasUpdate"
            />
            <Button
                class="w-full"
                @click="
                    () => {
                        emit('save', value)
                        emit('update:hasUpdate', false)
                    }
                "
            >
                Enregistrer
            </Button>
        </div>
    </SheetContent>
</template>

<style scoped></style>
