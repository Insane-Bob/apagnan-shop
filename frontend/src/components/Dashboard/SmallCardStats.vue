<script setup lang="js">
import { ref, defineProps, onMounted, watch, computed } from 'vue'
import CardHeader from '@components/ui/card/CardHeader.vue'
import CardTitle from '@components/ui/card/CardTitle.vue'
import CardContent from '@components/ui/card/CardContent.vue'
import { useDashboardTile } from '@components/Dashboard/useDashboardTile'

const props = defineProps({
    title: String,
    description: String,
    afterFetch: Function,
    url: String,
    dateRange: Object,
})

const { data } = useDashboardTile(props)
</script>

<template>
    <CardHeader
        class="flex flex-row items-center justify-between space-y-0 pb-2"
    >
        <CardTitle class="text-sm font-medium"> {{ props.title }} </CardTitle>
    </CardHeader>
    <CardContent>
        <slot name="content" v-bind="{ data }">
            <div class="text-2xl font-bold">{{ data }}</div>
            <p class="text-xs text-muted-foreground">{{ props.description }}</p>
        </slot>
    </CardContent>
</template>

<style scoped></style>
