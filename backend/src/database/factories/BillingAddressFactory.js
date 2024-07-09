import { Factory } from './Factory.js'
import {faker} from '@faker-js/faker'

export class BillingAddressFactory extends Factory{
    static model = 'BillingAddress'
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