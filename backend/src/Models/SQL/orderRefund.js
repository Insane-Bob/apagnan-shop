'use strict'
import { Model } from 'sequelize'

function model(sequelize, DataTypes) {
    class OrderRefund extends Model {
        static associate(models) {
            models.OrderRefund.belongsTo(models.RefundRequestOrder, {
                foreignKey: 'requestRefundId',
            })
        }
    }

    OrderRefund.init(
        {
            refundId: {
                type: DataTypes.STRING(40),
                primaryKey: true,
                allowNull: false,
            },
            requestRefundId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },

        {
            sequelize,
            modelName: 'OrderRefund',
        },
    )

    return OrderRefund
}

export default model
