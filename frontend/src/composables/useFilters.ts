import { computed, reactive, ref, watch } from 'vue'

type Filters<T> = {
    filters: T
    query: computedRef<URLSearchParams>
    resetFilters: () => void
}

export function useFilters<T extends object>(objectFilter: T): Filters<T> {
    const refObject = reactive({}) as T
    for (const key in objectFilter) {
        refObject[key] = objectFilter[key]
    }
    function resetFilters() {
        for (const key in refObject) {
            if (Array.isArray(refObject[key])) {
                refObject[key].splice(0)
            } else {
                refObject[key] = ''
            }
        }
    }

    function getCleanFilterObject() {
        const filterObject = { ...refObject }
        for (const key in filterObject) {
            if (
                filterObject[key] === '' ||
                (Array.isArray(filterObject[key]) &&
                    filterObject[key].length === 0)
            ) {
                delete filterObject[key]
            }
        }
        return filterObject
    }

    const query = computed(() => {
        return new URLSearchParams(getCleanFilterObject())
    })

    return { filters: refObject, query, resetFilters }
}
