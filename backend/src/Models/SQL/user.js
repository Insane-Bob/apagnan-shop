'use strict'

import { DenormalizableModel } from '../../lib/Denormalizer/DenormalizableModel.js'
import { UserServices } from '../../Services/UserServices.js'
import { UserSearchDenormalizationTask } from '../../lib/Denormalizer/tasks/UserSearchDenormalizationTask.js'
import { ProductDenormalizationTask } from '../../lib/Denormalizer/tasks/ProductDenormalizationTask.js'
import { OrderRefundRequestDenormalizationTask } from '../../lib/Denormalizer/tasks/OrderRefundRequestDenormalizationTask.js'
import { OrderDenormalizationTask } from '../../lib/Denormalizer/tasks/OrderDenormalizationTask.js'
import { DenormalizerTask } from '../../lib/Denormalizer/DenormalizerTask.js'

export const USER_ROLES = {
    USER: 'user',
    STORE_KEEPER: 'store_keeper',
    ADMIN: 'admin',
}

export class User extends DenormalizableModel {
    static associate(models) {
        models.User.hasOne(models.Customer, { foreignKey: 'userId' })
        models.User.hasMany(models.Token, { foreignKey: 'userId' })
        models.User.hasMany(models.UserConnectionAttempt, {
            foreignKey: 'userId',
        })
        models.User.hasMany(models.Review, { foreignKey: 'userId' })
    }

    static hooks(models) {
        models.User.beforeCreate(User.handlePasswordChanged)
        models.User.beforeUpdate((user) => User.handlePasswordChanged(user))
        models.User.beforeUpdate((user) => User.handleEmailChanged(user))
    }

    static handlePasswordChanged(user) {
        if (user.changed('password')) {
            user.password = UserServices.hashPassword(user.password)
        }
    }
    static handleEmailChanged(user) {
        if (user.changed('email')) {
            user.emailVerifiedAt = null
        }
    }

    hasRole(role) {
        return this.role === role
    }

    async canConnect() {
        const lastConnectionAttempt = await this.getUserConnectionAttempts({
            order: [['createdAt', 'DESC']],
            limit: 3,
        })
        if (lastConnectionAttempt.length < 3) return true
        let hasSuccessIn3LastAttempt = lastConnectionAttempt.some(
            (connectionAttempt) => connectionAttempt.success,
        )
        return hasSuccessIn3LastAttempt
    }

    isEmailVerified() {
        return this.emailVerifiedAt !== null
    }
}

function model(sequelize, DataTypes) {
    User.registerDenormalizerTask(
        new UserSearchDenormalizationTask().on([
            'firstName',
            'lastName',
            'email',
            'phone',
        ]),
    )

    User.registerDenormalizerTask(
        new ProductDenormalizationTask()
            .when([
                DenormalizerTask.EVENT.UPDATED,
                DenormalizerTask.EVENT.DELETED,
            ])
            .on(['firstName', 'lastName'])
            .from(async (user) => {
                let reviews = await user.getReviews()
                return await Promise.all(
                    reviews.map((review) => review.getProduct()),
                )
            }),
    )

    User.registerDenormalizerTask(
        new OrderRefundRequestDenormalizationTask()
            .when([
                DenormalizerTask.EVENT.UPDATED,
                DenormalizerTask.EVENT.DELETED,
            ])
            .on(['firstName', 'lastName', 'email', 'phone'])
            .from(async (user) => {
                let customer = await user.getCustomer()
                if (!customer) return []
                let orders = await customer.getOrders()
                return (
                    await Promise.all(
                        orders.map((order) => {
                            return order.getRefundRequestOrders()
                        }),
                    )
                ).flat()
            }),
    )

    User.registerDenormalizerTask(
        new OrderDenormalizationTask()
            .when([
                DenormalizerTask.EVENT.UPDATED,
                DenormalizerTask.EVENT.DELETED,
            ])
            .on(['firstName', 'lastName', 'email', 'phone'])
            .from(async (user) => {
                let customer = await user.getCustomer()
                if (!customer) return []
                return await customer.getOrders()
            }),
    )

    User.init(
        {
            firstName: DataTypes.STRING,
            lastName: DataTypes.STRING,
            phone: DataTypes.STRING,
            email: DataTypes.STRING,
            emailVerifiedAt: DataTypes.DATE,
            password: DataTypes.STRING,
            role: DataTypes.STRING,
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
            modelName: 'User',
        },
    )

    return User
}

export default model
