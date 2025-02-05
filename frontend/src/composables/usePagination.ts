import { computed, reactive } from 'vue'
export function usePagination(collectionLength: any) {
    const length = computed(() => collectionLength.value)

    const pagination = reactive({
        page: 1,
        limit: 10,
    })

    const total = computed(() => Math.ceil(length.value / pagination.limit))

    const currentPage = computed(() => pagination.page)

    const query = computed(() => {
        return new URLSearchParams({
            page: pagination.page.toString(),
            limit: pagination.limit.toString(),
        })
    })

    const dataTablePagination = computed(() => ({
        nextPage: next,
        prevPage: prev,
        goToPage: goTo,
        setLimit,
        total: total.value,
        currentPage: currentPage.value,
        limit: pagination.limit,
    }))

    function next() {
        if (pagination.page < total.value) pagination.page++
    }

    function prev() {
        if (pagination.page > 1) pagination.page--
    }

    function goTo(page: number) {
        if (page > 0 && page <= total.value && page !== currentPage.value) {
            pagination.page = page
            return true
        } else return false
    }

    function setLimit(limit: number) {
        pagination.limit = limit
        goTo(1)
    }

    return {
        query,
        currentPage,
        dataTablePagination,
        total,
        next,
        prev,
        goTo,
        setLimit,
    }
}
