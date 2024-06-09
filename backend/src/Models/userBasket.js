'use strict'

import { Model } from 'sequelize'

export class UserBasket extends Model {
    static associate(models) {
        models.UserBasket.belongsTo(models.User, { foreignKey: 'userId' })
        //models.UserBasket.hasOne(models.Product, { foreignKey: 'productId' })
    }

    hasRole(role) {
        return this.role === role
    }
}

function model(sequelize, DataTypes) {
    UserBasket.init(
        {
            productId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
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
            modelName: 'UserBasket',
        },
    )

    return UserBasket
}

export default model
