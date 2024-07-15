'use strict'

import { OrderStatus as OrderStatusEnum } from '../../Enums/OrderStatus.js'
import { Model } from 'sequelize'

export class OrderStatus extends Model {
    static associate(models) {
        models.OrderStatus.belongsTo(models.Order, {
            foreignKey: 'orderId',
        })
    }
}
function model(sequelize, DataTypes) {
    OrderStatus.init(
        {
            orderId: {
                type: DataTypes.INTEGER,
            },
            status: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: OrderStatusEnum.PENDING,
            },
        },
        {
            sequelize,
            modelName: 'OrderStatus',
            createdAt: true,
            updatedAt: false,
        },
    )

    return OrderStatus
}
export default model
