import { Factory } from './Factory.js'
import { faker } from '@faker-js/faker'

export class ProductSpecificsFactory extends Factory {
    static model = 'Specific'
    static instanciate() {
        return {
            name: faker.lorem.word({
                length: 2,
            }),
            content: faker.lorem.sentence(),
        }
    }
}
