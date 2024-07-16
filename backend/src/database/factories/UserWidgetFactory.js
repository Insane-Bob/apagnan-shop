import { Factory } from './Factory.js'
import { faker } from '@faker-js/faker'
export class UserWidgetFactory extends Factory{
  static model = 'UserWidget'
  static instanciate(){
    return {
      json:JSON.stringify([
        {
          name:faker.lorem.word(),
          styles: {}
        }
      ])
    }
  }
}