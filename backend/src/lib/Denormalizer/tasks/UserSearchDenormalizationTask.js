import { DenormalizerTask } from '../DenormalizerTask.js'
import { Database } from '../../../Models/index.js'
export class UserSearchDenormalizationTask extends DenormalizerTask {
    static model = 'Users'
    constructor() {
        super()
    }
    fetch(usersIds) {
        return Database.getInstance()
            .models.User.unscoped()
            .findAll({
                attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
                where: {
                    id: usersIds,
                },
                include: {
                    model: Database.getInstance().models.Customer,
                    attributes: ['stripeId'],
                    include: {
                        model: Database.getInstance().models.BillingAddress,
                        attributes: [
                            'id',
                            'street',
                            'city',
                            'region',
                            'postalCode',
                            'country',
                        ],
                    },
                },
            })
    }
}
