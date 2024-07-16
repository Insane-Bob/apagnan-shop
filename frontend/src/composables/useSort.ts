import { computed, reactive } from 'vue'

export function useSort(defaultSortBy = 'id', defaultOrder = 'desc') {
    const sort = reactive({
        key: defaultSortBy,
        direction: defaultOrder,
    })

    function changeSort(column: string) {
        if (sort.key === column) {
            sort.direction = sort.direction === 'asc' ? 'desc' : 'asc'
        } else {
            sort.key = column
            sort.direction = 'asc'
        }
    }

    const dataTableSort = computed(() => {
        return {
            key: sort.key,
            direction: sort.direction,
            changeSort,
        }
    })

    const sortQuery = computed(() => {
        return new URLSearchParams({
            order: sort.key,
            direction: sort.direction,
        })
    })

    return {
        sortQuery,
        sort,
        changeSort,
        dataTableSort,
    }
}
