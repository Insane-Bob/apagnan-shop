'use strict'

import { Model } from 'sequelize'

export class UserBasket extends Model {
    static associate(models) {
        models.UserBasket.belongsTo(models.User, { foreignKey: 'userId' })
        models.UserBasket.belongsTo(models.StockTransaction, {
            foreignKey: 'stockTransactionId',
            as: 'stockTransaction',
        })
    }

    async getProduct() {
        this.product =
            this.product || (await this.stockTransaction.getProduct())
        return this.product
    }
}

function model(sequelize, DataTypes) {
    UserBasket.init(
        {
            stockTransactionId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            quantity: {
                type: DataTypes.VIRTUAL,
                get() {
                    return (
                        -this?.stockTransaction?.quantity ||
                        -this?.StockTransaction?.quantity
                    )
                },
            },
            product: {
                type: DataTypes.VIRTUAL,
                get() {
                    return (
                        this?.stockTransaction?.Product ||
                        this?.StockTransaction?.Product ||
                        null
                    )
                },
            },
        },
        {
            sequelize,
            modelName: 'UserBasket',
            include: [
                {
                    model: sequelize.models.StockTransaction,
                    as: 'stockTransaction',
                },
            ],
        },
    )

    return UserBasket
}

export default model
