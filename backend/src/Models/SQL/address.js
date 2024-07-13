'use strict'
import { DenormalizableModel } from '../../lib/Denormalizer/DenormalizableModel.js'
import { UserSearchDenormalizationTask } from '../../lib/Denormalizer/tasks/UserSearchDenormalizationTask.js'
function model(sequelize, DataTypes) {
    class Address extends DenormalizableModel {
        static associate(models) {
            models.Address.belongsTo(models.Customer, {
                foreignKey: 'customerId',
            })
            models.Address.hasMany(models.Order, {
                foreignKey: 'shippingAddressId',
                as: 'shipping_address',
            })
            models.Address.hasMany(models.Order, {
                foreignKey: 'billingAddressId',
                as: 'billing_address',
            })
        }

        async getUser() {
            let customer = await this.getCustomer()
            return await customer.getUser()
        }
    }

    Address.registerDenormalizerTask(
        new UserSearchDenormalizationTask()
            .on(['street', 'city', 'country', 'region', 'postalCode'])
            .from(async (address) => {
                return await address.getUser()
            }),
    )

    Address.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            customerId: DataTypes.INTEGER,
            street: DataTypes.STRING,
            city: DataTypes.STRING,
            region: DataTypes.STRING,
            postalCode: DataTypes.STRING,
            country: DataTypes.STRING,
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Address',
        },
    )

    return Address
}

export default model
