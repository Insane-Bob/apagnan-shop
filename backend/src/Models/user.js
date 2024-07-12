'use strict'

import { DenormalizableModel } from '../lib/Denormalizer/DenormalizableModel.js'
import { UserServices } from '../Services/UserServices.js'
import { UserSearchDenormalizationTask } from '../lib/Denormalizer/tasks/UserSearchDenormalizationTask.js'
import { ProductDenormalizationTask } from '../lib/Denormalizer/tasks/ProductDenormalizationTask.js'

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
        models.User.hasMany(models.Review,{foreignKey:'userId'})
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
        new UserSearchDenormalizationTask().on([
            "firstName","lastName","email","phone"
        ])
    )


    User.registerDenormalizerTask(
      new ProductDenormalizationTask().on([
        "firstName","lastName"
      ]).from(async (user)=>{
          let reviews = await user.getReviews()
          return await Promise.all(reviews.map(review => review.getProduct()))
      })
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
