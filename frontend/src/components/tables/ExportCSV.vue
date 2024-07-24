<script setup lang="ts">
import { Button } from '@components/ui/button'
import { useRoute } from 'vue-router'

const props = defineProps<{
    selected?: number[]
    export: () => { id: number }[]
}>()

const route = useRoute()

async function handleClick() {
    const allData = await props.export()
    if (!allData.length) return
    const filteredData = !props?.selected?.length
        ? allData
        : allData.filter((row: { id: number }) => {
              return props?.selected?.includes(row.id)
          })

    const keys = Object.keys(filteredData[0])
        .filter((key) => typeof filteredData[0][key] !== 'object')
        .sort((a, b) => a.localeCompare(b))
    const headers = keys.join(',')
    const csv = filteredData.map((row: object) => {
        return keys
            .map((key) => {
                return row[key]
            })
            .join(',')
    })
    const csvContent =
        'data:text/csv;charset=utf-8,' + [headers, ...csv].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)

    let name =
        route.meta.label ??
        route.name ??
        window.location.pathname.replace(/^\//gi, '')
    link.setAttribute('download', name + '.csv')
    document.body.appendChild(link)
    link.click()
}
</script>

<template>
    <Button
        variant="outlineDashboard"
        class="flex items-center gap-3"
        @click="handleClick"
    >
        <ion-icon name="download-outline" />
        Exporter en CSV
        {{ props?.selected?.length ? `(${props?.selected?.length})` : '' }}
    </Button>
</template>

<style scoped></style>
