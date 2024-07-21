'use strict'

import { Model } from 'sequelize'
import { OrderStatus } from '../../Enums/OrderStatus.js'
import { PaymentStatus } from './payment.js'

export class Order extends Model {
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
        models.Order.hasMany(models.OrderStatus, {
            foreignKey: 'orderId',
            as: 'statusHistory',
        })
        models.Order.belongsTo(models.Promo, {
            foreignKey: 'promoId',
        })
    }

    static addScopes(models) {
        models.Order.addScope(
            'defaultScope',
            {
                include: [
                    {
                        model: models.OrderStatus,
                        as: 'statusHistory',
                    },
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
                                model: models.User.unscoped(),
                            },
                        ],
                    },
                ],
            },
            { override: true },
        )

        models.Order.addScope('withProducts', {
            include: [
                {
                    model: models.OrderStatus,
                    as: 'statusHistory',
                },
                {
                    model: models.Promo,
                },
                {
                    model: models.OrderDetail,
                    include: [
                        {
                            model: models.Product,
                            include: [
                                {
                                    association: 'images',
                                },
                            ],
                        },
                    ],
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
        })
    }

    static hooks(models) {
        models.Order.addHook('afterCreate', async (order, options) => {
            let status = await models.OrderStatus.create(
                {
                    orderId: order.id,
                    status: OrderStatus.PENDING,
                    createdAt: new Date(),
                },
                {
                    transaction: options.transaction,
                },
            )
            order.statusHistory = [status]
        })
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
            nbProducts: {
                type: DataTypes.VIRTUAL,
                get() {
                    return (
                        this.OrderDetails?.reduce((acc, orderDetail) => {
                            return acc + orderDetail.quantity
                        }, 0) || null
                    )
                },
            },
            status: {
                type: DataTypes.VIRTUAL,
                get() {
                    if (!this.statusHistory) return null
                    return (
                        this.statusHistory.reduce((acc, status) => {
                            return status.createdAt > acc.createdAt
                                ? status
                                : acc
                        }, this.statusHistory[0])?.status ?? null
                    )
                },
            },
            paid: {
                type: DataTypes.VIRTUAL,
                get() {
                    if (!this.Payments) return null
                    return (
                        this.Payments.reduce((acc, payment) => {
                            return payment.createdAt > acc.createdAt
                                ? payment
                                : acc
                        }, this.Payments[0])?.status == PaymentStatus.SUCCEEDED
                    )
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
