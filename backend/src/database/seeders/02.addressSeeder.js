import { AddressFactory } from '../factories/AddressFactory.js'

export default async function () {
    const customerIDS = this.references
        .get('users')
        .map((user) => user.customer.id)
    const addresses = new Map()
    for (let customerId of customerIDS) {
        let _addresses = await AddressFactory.count(2).create({
            customerId,
        })
        addresses.set(customerId, _addresses)
    }
    this.references.set('addresses', addresses)
}
