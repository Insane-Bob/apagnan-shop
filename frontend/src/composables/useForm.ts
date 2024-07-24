import { ApiClient } from '@/lib/apiClient'
import { ref } from 'vue'
import { toast } from '@components/ui/toast'

export function useForm(url, payload, method = 'post') {
    const apiClient = new ApiClient()
    const errors = ref(null)
    const data = ref(null)
    const loading = ref(false)

    async function submit(onSuccess = null, onError = null) {
        loading.value = true
        errors.value = null
        try {
            const response = await apiClient[method](url, payload.value)
            data.value = response.data
            if (onSuccess) onSuccess(data)
            return data
        } catch (e) {
            if (e.response && e.response.status === 422)
                errors.value = e.response.data.errors
            if (onError) onError(e)

            if (!e?.response || e?.response?.status !== 422)
                toast({
                    title: "Une erreur s'est produite lors de la soumission du formulaire",
                    variant: 'destructive',
                })
            throw e
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
