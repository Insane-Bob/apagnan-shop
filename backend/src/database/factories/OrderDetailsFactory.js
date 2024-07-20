import { Factory } from './Factory.js'
import { faker } from '@faker-js/faker'

export class OrderDetailsFactory extends Factory {
    static model = 'OrderDetail'
    static async instanciate() {
        return {
            productId: faker.number.int(),
            quantity: faker.number.int(),
            unitPrice: faker.number.float({
                min: 100,
                max: 600,
            }),
        }
    }
}
