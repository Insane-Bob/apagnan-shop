'use strict'
import { DenormalizableModel } from '../lib/Denormalizer/DenormalizableModel.js'
import { UserSearchDenormalizationTask } from '../lib/Denormalizer/tasks/UserSearchDenormalizationTask.js'
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
      new UserSearchDenormalizationTask()
        .on([
          "street","city","country","region","postalCode"
        ])
        .from(async (address)=>{
          return await address.getUser()
        })
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
