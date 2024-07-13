import { DenormalizerTask } from '../DenormalizerTask.js'
import { Database } from '../../../Models/index.js'
import { Schema } from 'mongoose'
export class UserSearchDenormalizationTask extends DenormalizerTask {
    static schema = new Schema({
        id: Number,
        firstName: String,
        lastName: String,
        Customer: {
            stripeId: String,
            Addresses: [
                {
                    street: String,
                    city: String,
                    state: String,
                    postalCode: String,
                    country: String,
                },
            ],
        },
    })

    constructor() {
        super()
        this.in('users')
    }
    fetch(usersIds) {
        return Database.getInstance()
            .models.User.unscoped()
            .findAll({
                where: {
                    id: usersIds,
                },
                include: {
                    model: Database.getInstance().models.Customer,
                    include: [Database.getInstance().models.Address],
                },
            })
    }
}
