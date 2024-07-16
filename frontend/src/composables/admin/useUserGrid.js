import { onMounted, ref } from 'vue'
import { apiClient } from '@lib/apiClient.ts'
import { useUserStore } from '@store/user'

export function useUserGrid() {
    const grid = ref(null)
    const user = useUserStore()
    async function fetch() {
        const { data } = await apiClient.get(`/users/${user.get.id}/widget`)
        grid.value = data
    }
    async function set(widgetsConfig) {
        grid.value = widgetsConfig.map((widget) => ({
            id: widget.id,
            active: widget.active || false,
            gs: widget.gs,
        }))

        await apiClient.put(`/users/${user.get.id}/widget`, {
            data: grid.value,
        })
    }

    onMounted(() => {
        fetch()
    })

    return { fetch, grid, set }
}
