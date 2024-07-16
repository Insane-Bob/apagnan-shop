'use strict'
import { Model } from 'sequelize'

export class PaymentStatus {
    static PENDING = 'pending'
    static SUCCEEDED = 'succeeded'
    static FAILED = 'failed'
}

function model(sequelize, DataTypes) {
    class Payment extends Model {
        static associate(models) {
            models.Payment.belongsTo(models.Order, { foreignKey: 'orderId' })
            models.Payment.hasOne(models.RefundRequestOrder, {
                foreignKey: 'sessionId',
            })
        }
    }

    Payment.init(
        {
            sessionId: {
                type: DataTypes.STRING(40),
                allowNull: false,
                primaryKey: true,
            },
            paymentIntentId: {
                type: DataTypes.STRING(40),
                allowNull: true,
            },
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM(
                    PaymentStatus.SUCCEEDED,
                    PaymentStatus.FAILED,
                    PaymentStatus.PENDING,
                ),
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
            modelName: 'Payment',
        },
    )

    return Payment
}

export default model
