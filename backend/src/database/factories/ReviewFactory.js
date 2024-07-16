import { Factory } from './Factory.js'
import { faker } from '@faker-js/faker'

export class ReviewFactory extends Factory{
  static model = 'Review'
  static async instanciate(){
    return {
      rate: faker.number.int(1,5),
      content: faker.lorem.text(),
    }
  }
}