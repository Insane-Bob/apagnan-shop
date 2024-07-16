'use strict'
import { Model } from 'sequelize'
import { DenormalizableModel } from '../../lib/Denormalizer/DenormalizableModel.js'
import { OrderRefundRequestDenormalizationTask } from '../../lib/Denormalizer/tasks/OrderRefundRequestDenormalizationTask.js'

function model(sequelize, DataTypes) {
    class RefundRequestOrder extends DenormalizableModel {
        static associate(models) {
            models.RefundRequestOrder.belongsTo(models.Order, {
                foreignKey: 'orderId',
            })
            models.RefundRequestOrder.belongsTo(models.Payment, {
                foreignKey: 'sessionId',
            })
            models.RefundRequestOrder.hasOne(models.OrderRefund, {
                foreignKey: 'requestRefundId',
            })
        }

        async getCustomer() {
            const order = await this.getOrder()
            return order.getCustomer()
        }
    }

    RefundRequestOrder.registerDenormalizerTask(
        new OrderRefundRequestDenormalizationTask().on(['reason', 'approved']),
    )

    RefundRequestOrder.init(
        {
            sessionId: {
                type: DataTypes.STRING(40),
                allowNull: false,
            },
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            reason: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            approved: {
                type: DataTypes.BOOLEAN,
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
            modelName: 'RefundRequestOrder',
        },
    )

    return RefundRequestOrder
}

export default model
