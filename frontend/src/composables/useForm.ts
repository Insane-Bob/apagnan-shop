import { apiClient } from '@/lib/apiClient'
import { ref } from 'vue'

export function useForm(url, payload , method = 'post') {
    const errors = ref(null)
    const data = ref(null)
    const loading = ref(false)

    async function submit(onSuccess, onError) {
        loading.value = true
        errors.value = null
        try {
            const response = await apiClient[method](url, payload.value)
            data.value = response.data
            onSuccess(data)
        } catch (e) {
            if (e.response.status === 422) errors.value = e.response.data.errors
            if(onError) onError(e)
            else throw e
        } finally {
            loading.value = false
        }
    }

    return {
        errors,
        data,
        loading,
        submit,
    }
}
