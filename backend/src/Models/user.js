'use strict'

import { DenormalizableModel } from '../lib/Denormalizer/DenormalizableModel.js'
import { DenormalizerTaskBuilder } from '../lib/Denormalizer/DenormalizerTaskBuilder.js'
import { SearchUserDocument } from '../lib/Denormalizer/Documents/search/SearchUserDocument.js'

export const USER_ROLES = {
    USER: 'user',
    STORE_KEEPER: 'store_keeper',
    ADMIN: 'admin',
}

export class User extends DenormalizableModel {
    static associate(models) {
        models.User.hasOne(models.Customer, { foreignKey: 'userId' })
        models.User.hasMany(models.Token, { foreignKey: 'userId' })
    }

    hasRole(role) {
        return this.role === role
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
