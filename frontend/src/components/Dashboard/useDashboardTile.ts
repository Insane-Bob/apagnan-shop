import { computed, onMounted, ref, watch } from 'vue'
import { ApiClient } from '../../lib/apiClient.ts'

export function useDashboardTile(props) {
    const dateRange = computed(() => {
        return props.dateRange
    })

    const apiClient = new ApiClient()

    const data = ref()
    async function fetch() {
        let query = new URLSearchParams({
            start: new Date(dateRange.value.start).toISOString(),
            end: new Date(dateRange.value.end).toISOString(),
        })
        const { data: apiData } = await apiClient.get(
            props.url + '?' + query.toString(),
        )
        props.afterFetch(apiData, data)
    }
    onMounted(() => {
        fetch()
    })

    watch(
        dateRange,
        () => {
            fetch()
        },
        { deep: true },
    )

    return {
        dateRange,
        data,
    }
}
