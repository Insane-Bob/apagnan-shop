'use strict'
import { Model } from 'sequelize'

export class OrderDetails extends Model {
    static associate(models) {
        models.OrderDetails.belongsTo(models.Order, { foreignKey: 'orderId' })
        models.OrderDetails.belongsTo(models.Product, {
            foreignKey: 'productId',
        })
    }
}
function model(sequelize, DataTypes) {
    OrderDetails.init(
        {
            orderId: DataTypes.INTEGER,
            productId: DataTypes.INTEGER,
            quantity: DataTypes.INTEGER,
            price: DataTypes.FLOAT,
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
            modelName: 'OrderDetails',
        },
    )

    return OrderDetails
}
export default model
