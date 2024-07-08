import { Factory } from './Factory.js'
import { faker } from '@faker-js/faker'
import { CustomerFactory } from './CustomerFactory.js'

export class UserFactory extends Factory{
  static model = 'User'
  static instanciate(){
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password()
    }
  }

  static _withCustomer = false
  static withCustomer(){
    this._withCustomer = true
    return this
  }
  static async afterCreate(user){
    if(this._withCustomer)
      await CustomerFactory.count(1).create({userId: user.id})
  }
}