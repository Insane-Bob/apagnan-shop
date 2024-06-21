import axios from 'axios'

export class DeliveryServices {
    static instance = axios.create({
        baseURL: 'https://api.laposte.fr/suivi/v2',
        headers: {
            'X-Okapi-Key': process.env.POSTE_API_KEY,
            Accept: 'application/json',
        },
    })
    static retreeveDelivery(id) {
        return this.instance.get(`/idships/${id}`)
    }
}
