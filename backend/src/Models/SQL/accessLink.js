'use strict'
import { Model } from 'sequelize'

function model(sequelize, DataTypes) {
    class AccessLink extends Model {
        static associate(models) {
            models.AccessLink.belongsTo(models.User, { foreignKey: 'userId' })
        }

        get isExpired() {
            return this.expireAt < new Date()
        }

        get stillAccess() {
            if (this.maxUseCount === -1) return true
            return this.useCount < this.maxUseCount
        }

        get isStarted() {
            return this.validAt < new Date()
        }

        get isValid() {
            return this.isStarted && !this.isExpired && this.stillAccess
        }
    }

    AccessLink.init(
        {
            identifier: {
                type: DataTypes.STRING,
                primaryKey: true,
            },
            userId: DataTypes.INTEGER,
            validAt: DataTypes.DATE,
            expireAt: DataTypes.DATE,
            useCount: DataTypes.INTEGER,
            maxUseCount: DataTypes.INTEGER,
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
            modelName: 'AccessLink',
            primaryKey: 'identifier',
        },
    )

    return AccessLink
}

export default model
