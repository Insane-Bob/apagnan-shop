import { UserFactory } from '../factories/UserFactory.js'
import { faker } from '@faker-js/faker'

export default async function () {
    const adminUser = await UserFactory.withWidget()
        .withCustomer()
        .count(1)
        .create({
            email: 'admin@email.com',
            password: 'admin@email.comA2024',
            role: 'admin',
            emailVerifiedAt: new Date(),
        })

    const users = await UserFactory.withWidget(false)
        .withCustomer()
        .count(10)
        .create()
    this.references.set('users', [...users, adminUser])
}
