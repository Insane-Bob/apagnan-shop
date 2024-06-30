'use strict'

import { DenormalizerTaskBuilder } from '../lib/Denormalizer/DenormalizerTaskBuilder.js'
import { SearchUserDocument } from '../lib/Denormalizer/Documents/search/SearchUserDocument.js'
import { DenormalizableModel } from '../lib/Denormalizer/DenormalizableModel.js'
function model(sequelize, DataTypes) {
    class BillingAddress extends DenormalizableModel {
        static associate(models) {
            models.BillingAddress.belongsTo(models.Customer, {
                foreignKey: 'customerId',
            })
            models.BillingAddress.hasMany(models.Order, {
                foreignKey: 'addressId',
            })
        }

        async getUser() {
            let customer = await this.getCustomer()
            return await customer.getUser()
        }
    }

    BillingAddress.registerDenormalizerTask(
        DenormalizerTaskBuilder.create()
            .in('search_user')
            .fetchFrom(async (billingAddressInstance) => {
                return await billingAddressInstance.getUser()
            })
            .to(SearchUserDocument),
    )

    BillingAddress.init(
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
            modelName: 'BillingAddress',
        },
    )

    return BillingAddress
}

export default model
