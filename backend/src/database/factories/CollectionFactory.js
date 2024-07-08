import { Factory } from './Factory.js'
import { faker } from '@faker-js/faker'

export class CollectionFactory extends Factory{
  static model = 'Collection'
  static instanciate(){
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      published : faker.datatype.boolean(),
      promoted : faker.datatype.boolean()
    }
  }
}