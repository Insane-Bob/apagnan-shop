'use strict'

import { OrderStatus } from '../Enums/OrderStatus.js'
import { DenormalizableModel } from '../lib/Denormalizer/DenormalizableModel.js'
import { OrderRefundRequestDenormalizationTask } from '../lib/Denormalizer/tasks/OrderRefundRequestDenormalizationTask.js'
import { OrderDenormalizationTask } from '../lib/Denormalizer/tasks/OrderDenormalizationTask.js'
import { DenormalizerTask } from '../lib/Denormalizer/DenormalizerTask.js'

export class Order extends DenormalizableModel {
    static associate(models) {
        models.Order.belongsTo(models.Customer, {
            foreignKey: 'customerId',
        })
        models.Order.hasMany(models.Payment, { foreignKey: 'orderId' })
        models.Order.hasMany(models.RefundRequestOrder, {
            foreignKey: 'orderId',
        })
        models.Order.hasMany(models.OrderDetail, {
            foreignKey: 'orderId',
        })
        models.Order.belongsTo(models.Address, {
            foreignKey: 'shippingAddressId',
            as: 'shipping_address',
        })
        models.Order.belongsTo(models.Address, {
            foreignKey: 'billingAddressId',
            as: 'billing_address',
        })
    }

    static addScopes(models) {
        models.Order.addScope(
            'defaultScope',
            {
                include: [
                    {
                        model: models.OrderDetail,
                    },
                    {
                        model: models.Address,
                        as: 'billing_address',
                    },
                    {
                        model: models.Address,
                        as: 'shipping_address',
                    },
                    {
                        model: models.Customer,
                        include: [
                            {
                                model: models.User,
                            },
                        ],
                    },
                ],
            },
            { override: true },
        )
    }

    getTotal() {
        if (this.OrderDetails) {
            return this.OrderDetails.reduce((acc, orderDetail) => {
                return acc + orderDetail.total
            }, 0)
        } else {
            return 0
        }
    }
}
function model(sequelize, DataTypes) {
    Order.registerDenormalizerTask(
        new OrderDenormalizationTask()
            .when([DenormalizerTask.EVENT.UPDATED])
            .on(['status']),
    )

    Order.init(
        {
            customerId: DataTypes.INTEGER,
            // @TODO : Add an order_number field and use it in the email template SuccessPaymentEmail
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            shippingAddressId: DataTypes.INTEGER,
            billingAddressId: DataTypes.INTEGER,
            status: {
                type: DataTypes.STRING(50),
                allowNull: false,
                defaultValue: OrderStatus.PENDING,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            total: {
                type: DataTypes.VIRTUAL,
                get() {
                    return this.getTotal()
                },
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
