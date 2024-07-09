import { Factory } from './Factory.js'
import { faker } from '@faker-js/faker'

export class CustomerFactory extends Factory{
  static model = 'Customer'
  static instanciate(){
    return {
      userId: faker.number.int(),
      stripeId: faker.string.sample(225),
    }
  }
}