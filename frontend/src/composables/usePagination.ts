import { computed, reactive } from 'vue'
export function usePagination(collectionLength: any) {
    const length = computed(() => collectionLength.value)

    const pagination = reactive({
        page: 1,
        limit: 5,
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
        if (page > 0 && page <= total.value) {
            pagination.page = page
        }
    }

    return {
        query,
        currentPage,
        dataTablePagination,
        total,
        next,
        prev,
        goTo,
    }
}
