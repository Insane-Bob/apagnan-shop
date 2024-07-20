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

    make(method : string ,path : string, options : object = {}){
        return axios({
            method: method,
            url: this.baseUrl + this.formatedPath(path),
            headers: this.headers,
            ...options
        })
    }

    get(path: string) {
        return this.make('get',path)
    }

    post(path: string, data: any) {
        return this.make('post',path,{data:data})
    }

    put(path: string, data: any) {
        return this.make('put',path,{data:data})
    }

    patch(path: string, data: any) {
        return this.make('patch',path,{data:data})
    }

    delete(path: string) {
        return this.make('delete',path)
    }
    private formatedPath(path: string) {
        return path.startsWith('/') ? path : `/${path}`
    }
}

const apiClient = new ApiClient()

export { ApiClient, apiClient }