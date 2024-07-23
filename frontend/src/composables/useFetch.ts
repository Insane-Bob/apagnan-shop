import { ApiClient } from '@/lib/apiClient'
import { computed } from 'vue'
import type { ComputedRef } from 'vue'
import type { AxiosRequestConfig } from 'axios'

export function useFetch(
    url: ComputedRef,
    query = null,
    onSuccess = null,
    onError = null,
) {
    const apiClient = new ApiClient()
    const _path = computed(() => {
        return url.value + (query ? `?${query}` : '')
    })
    async function _fetch(
        method: string,
        config: AxiosRequestConfig,
    ): Promise<any | void> {
        try {
            const response = await apiClient[method](_path.value, config)
            if (onSuccess) onSuccess(response.data)
            return response.data
        } catch (e) {
            console.error(e)
            if (onError) onError(e)
            else throw e
        }
    }

    async function post(payload: object, config: object = {}, ...args: any[]) {
        return _fetch(
            'post',
            {
                ...config,
                data: payload,
            },
            ...args,
        )
    }

    function get(config: object = {}, ...args: any[]) {
        return _fetch('get', config, ...args)
    }

    return { post, get }
}
