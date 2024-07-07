'use strict'

import { DenormalizableModel } from '../lib/Denormalizer/DenormalizableModel.js'
import { DenormalizerTaskBuilder } from '../lib/Denormalizer/DenormalizerTaskBuilder.js'
import { SearchUserDocument } from '../lib/Denormalizer/Documents/search/SearchUserDocument.js'
import { UserServices } from '../Services/UserServices.js'

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
}

function model(sequelize, DataTypes) {
    User.registerDenormalizerTask(
        DenormalizerTaskBuilder.create()
            .in('search_user')
            .to(SearchUserDocument),
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
