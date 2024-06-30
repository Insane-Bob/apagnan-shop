'use strict'
import { Model } from 'sequelize'

export class OrderDetails extends Model {
    static associate(models) {
        models.OrderDetail.belongsTo(models.Order, { foreignKey: 'orderId' })
        models.OrderDetail.belongsTo(models.Product, {
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
            unitPrice: DataTypes.FLOAT,
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            total: {
                type: DataTypes.VIRTUAL,
                get() {
                    return this.quantity * this.unitPrice
                },
            },
        },
        {
            sequelize,
            modelName: 'OrderDetail',
        },
    )

    return OrderDetails
}
export default model
