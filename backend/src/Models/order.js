'use strict'
import { Model } from 'sequelize'

export class Order extends Model {
    static associate(models) {
        models.Order.belongsTo(models.Customer, { foreignKey: 'customerId' })
        models.Order.hasMany(models.Payment, { foreignKey: 'orderId' })
        models.Order.hasMany(models.RefundRequestOrder, {
            foreignKey: 'orderId',
        })
    }
}
function model(sequelize, DataTypes) {
    Order.init(
        {
            customerId: DataTypes.INTEGER,
            // @TODO : Add an order_number field and use it in the email template SuccessPaymentEmail   
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
            modelName: 'Order',
        },
    )

    return Order
}
export default model
