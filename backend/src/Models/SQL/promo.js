'use strict'

import { Model } from 'sequelize'

class Promo extends Model {
    static associate(models) {
        Promo.belongsToMany(models.Product, {
            through: 'PromoProducts',
            foreignKey: 'promoId',
            otherKey: 'productId',
        })
        Promo.belongsToMany(models.Customer, {
            through: 'PromoCustomers',
            foreignKey: 'promoId',
            otherKey: 'customerId',
        })
    }
}

function model(sequelize, DataTypes) {
    Promo.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            available: DataTypes.BOOLEAN,
            value: DataTypes.DECIMAL,
            type: DataTypes.ENUM('percent', 'amount'),
            code: DataTypes.STRING(50),
            promoted: DataTypes.BOOLEAN,
            stripeId: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            stock: {
                type: DataTypes.VIRTUAL,
            },
        },
        {
            sequelize,
            modelName: 'Promo',
        },
    )
    return Promo
}

export default model
