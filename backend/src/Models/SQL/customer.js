'use strict'
import { DenormalizableModel } from '../../lib/Denormalizer/DenormalizableModel.js'
import { UserSearchDenormalizationTask } from '../../lib/Denormalizer/tasks/UserSearchDenormalizationTask.js'
import { OrderRefundRequestDenormalizationTask } from '../../lib/Denormalizer/tasks/OrderRefundRequestDenormalizationTask.js'
import { DenormalizerTask } from '../../lib/Denormalizer/DenormalizerTask.js'
function model(sequelize, DataTypes) {
    class Customer extends DenormalizableModel {
        static associate(models) {
            models.Customer.belongsTo(models.User, { foreignKey: 'userId' })
            models.Customer.hasMany(models.BillingAddress, {
                foreignKey: 'customerId',
            })
            models.Customer.hasMany(models.Order, { foreignKey: 'customerId' })
        }
    }

    Customer.registerDenormalizerTask(
        new UserSearchDenormalizationTask().from(async (customer) => {
            return await customer.getUser()
        }),
    )

    Customer.init(
        {
            userId: DataTypes.INTEGER,
            stripeId: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'Customer',
        },
    )

    return Customer
}

export default model
