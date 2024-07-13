'use strict'

import { Model } from 'sequelize'

function model(sequelize, DataTypes) {
    class UserConnectionAttempt extends Model {
        static associate(models) {
            models.UserConnectionAttempt.belongsTo(models.User, {
                foreignKey: 'userId',
            })
        }
    }

    UserConnectionAttempt.init(
        {
            userId: DataTypes.INTEGER,
            success: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'UserConnectionAttempt',
            updatedAt: false,
        },
    )

    return UserConnectionAttempt
}

export default model
