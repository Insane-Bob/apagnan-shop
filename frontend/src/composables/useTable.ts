import { onMounted, ref, watch } from 'vue'
import { ApiClient } from '@/lib/apiClient'
import { useSort } from '@/composables/useSort'
import { usePagination } from '@/composables/usePagination'

export function useTable(url: string, query = null, ...options) {
    const apiClient = new ApiClient()
    const collection = ref<Object[]>([])
    const collectionLength = ref<number>(0)

    const { dataTableSort, sortQuery } = useSort()
    const {
        currentPage,
        dataTablePagination,
        query: paginatedQuery,
        goTo,
    } = usePagination(collectionLength)

    async function fetch(onSuccess = () => {}, onError = () => {}) {
        try {
            let URL =
                url +
                '?' +
                paginatedQuery.value.toString() +
                '&' +
                sortQuery.value.toString()

            if (query?.value) {
                URL += '&' + query.value.toString()
            }

            const response = await apiClient.get(URL, ...options)
            collection.value = response.data.data
            collectionLength.value = response.data.total
            onSuccess()
        } catch (e) {
            onError(e)
        }
    }

    if (query) {
        watch(query, () => {
            let res = goTo(1)
            console.log(res)
            if (!res) fetch()
        })
    }

    watch(sortQuery, () => {
        let res = goTo(1)
        if (!res) fetch()
    })

    watch([currentPage], () => {
        fetch()
    })

    onMounted(() => {
        fetch()
    })

    return {
        fetch,
        rows: collection,
        sorting: dataTableSort,
        pagination: dataTablePagination,
    }
}
