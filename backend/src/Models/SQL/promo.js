'use strict'

import { Model } from 'sequelize'

class Promo extends Model {
    static associate(models) {
        Promo.hasMany(models.Order, {
            foreignKey: 'promoId',
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
        },
        {
            sequelize,
            modelName: 'Promo',
        },
    )
    return Promo
}

export default model
