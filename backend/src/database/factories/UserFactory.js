import { Factory } from './Factory.js'
import { faker } from '@faker-js/faker'
import { CustomerFactory } from './CustomerFactory.js'
import { UserWidgetFactory } from './UserWidgetFactory.js'

export class UserFactory extends Factory {
    static model = 'User'
    static instanciate() {
        return {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
        }
    }

    static _withCustomer = false
    static withCustomer(value = true) {
        this._withCustomer = value
        return this
    }

    static _withWidget = false
    static withWidget(value = true) {
        this._withWidget = value
        return this
    }

    static async afterCreate(user) {
        if (this._withCustomer) {
            await CustomerFactory.count(1).create({ userId: user.id })
            user.customer = await user.getCustomer()
            user.Customer = user.customer
        }

        if (this._withWidget)
            await UserWidgetFactory.create({ userId: user.id })
    }
}
