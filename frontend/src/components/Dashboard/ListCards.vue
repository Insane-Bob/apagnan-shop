<script setup lang="ts">
import CardTitle from '@components/ui/card/CardTitle.vue'
import CardContent from '@components/ui/card/CardContent.vue'
import CardHeader from '@components/ui/card/CardHeader.vue'
import CardDescription from '@components/ui/card/CardDescription.vue'
import { useDashboardTile } from './useDashboardTile'

const props = defineProps({
    title: String,
    description: String,
    afterFetch: Function,
    url: String,
    dateRange: Object,
    id: String,
})

const { data } = useDashboardTile({
    ...props,
})
</script>

<template>
    <div class="h-full flex flex-col">
        <CardHeader class="">
            <CardTitle>{{ props.title }}</CardTitle>
            <CardDescription> {{ props.description }} </CardDescription>
        </CardHeader>
        <CardContent class="overflow-y-auto flex-1">
            <slot
                :name="props.id + ':item'"
                v-bind="{ item: d }"
                v-for="d in data"
            ></slot>
        </CardContent>
    </div>
</template>

<style scoped></style>
