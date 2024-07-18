import { Model } from 'sequelize'

function model(sequelize, DataTypes) {
    class UserNotificationSubscription extends Model {
        static associate(models) {
            models.UserNotificationSubscription.belongsTo(models.User, {
                foreignKey: 'userId',
            })

            models.UserNotificationSubscription.belongsTo(models.Product, {
                foreignKey: 'modelId',
                constraints: false,
                scope: {
                    modelType: 'product',
                },
                as: 'product',
            })

            models.UserNotificationSubscription.belongsTo(models.Collection, {
                foreignKey: 'modelId',
                constraints: false,
                scope: {
                    modelType: 'collection',
                },
                as: 'collection',
            })
        }
    }
    UserNotificationSubscription.init(
        {
            userId: DataTypes.INTEGER,
            modelId: DataTypes.INTEGER,
            modelType: DataTypes.STRING,
            type: DataTypes.STRING,
            activate: DataTypes.BOOLEAN,
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
            },
        },
        {
            sequelize,
            modelName: 'UserNotificationSubscription',
        },
    )
    return UserNotificationSubscription
}
export default model
