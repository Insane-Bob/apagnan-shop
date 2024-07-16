import { Factory } from './Factory.js'
import {faker} from '@faker-js/faker'

export class AddressFactory extends Factory {
    static model = 'Address'
    static instanciate() {
        return {
            street: faker.location.street(),
            city: faker.location.city(),
            region: faker.location.state(),
            country: faker.location.country(),
            postalCode: faker.location.zipCode(),
        }
    }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        