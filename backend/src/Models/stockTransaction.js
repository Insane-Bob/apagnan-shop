'use strict'
import { Model } from 'sequelize'

function model(sequelize, DataTypes) {
    class StockTransaction extends Model {
        static associate(models) {
            StockTransaction.belongsTo(models.Product, {
                foreignKey: 'productId',
            })
            StockTransaction.hasMany(models.UserBasket, {
                foreignKey: 'stockTransactionId',
            })
        }
    }
    StockTransaction.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            productId: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'StockTransaction',
            updatedAt: false,
        },
    )
    return StockTransaction
}

export default model
