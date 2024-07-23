'use strict'
import { Model } from 'sequelize'
import {Money} from "../../utils/money.js";

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
            unitPrice: DataTypes.FLOAT,
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            quantity: {
                type: DataTypes.INTEGER,
            },
            total: {
                type: DataTypes.VIRTUAL,
                get() {
                    return this.quantity * this.unitPrice
                },
            },
            totalFormatted: {
                type: DataTypes.VIRTUAL,
                get() {
                    return Money.format(this.total)
                }
            },
            unitPriceFormatted: {
                type: DataTypes.VIRTUAL,
                get() {
                    return Money.format(Number(this.unitPrice))
                }
            }
        },
        {
            sequelize,
            modelName: 'OrderDetail',
        },
    )

    return OrderDetails
}
export default model
