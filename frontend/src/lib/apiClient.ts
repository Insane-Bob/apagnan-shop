import axios from 'axios'

class ApiClient {
    baseUrl = import.meta.env.VITE_API_BASE_URL
    headers: any

    constructor() {
        if (localStorage.getItem('accessToken')) {
            this.headers = {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            }
        } else {
            this.headers = {
                'Content-Type': 'application/json',
            }
        }
    }

    async get(path: string) {
        return axios.get(this.baseUrl + this.formatedPath(path), {
            headers: this.headers,
        })
    }

    async post(path: string, data: any) {
        return axios.post(this.baseUrl + this.formatedPath(path), data, {
            headers: this.headers,
        })
    }

    async put(path: string, data: any) {
        return axios.put(this.baseUrl + this.formatedPath(path), data, {
            headers: this.headers,
        })
    }

    async delete(path: string) {
        return axios.delete(this.baseUrl + this.formatedPath(path), {
            headers: this.headers,
        })
    }
    private formatedPath(path: string) {
        return path.startsWith('/') ? path : `/${path}`
    }
}

const apiClient = new ApiClient()

export { ApiClient, apiClient }