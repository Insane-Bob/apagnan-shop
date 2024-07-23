'use scrict'
import { DenormalizableModel } from '../../lib/Denormalizer/DenormalizableModel.js'
import { ProductDenormalizationTask } from '../../lib/Denormalizer/tasks/ProductDenormalizationTask.js'

function model(sequelize, DataTypes) {
    class Review extends DenormalizableModel {
        static associate(models) {
            models.Review.belongsTo(models.Product, {
                foreignKey: 'productId',
            })
            models.Review.belongsTo(models.User, {
                foreignKey: 'userId',
            })
        }

        static addScopes(models) {
            models.Review.addScope('withProduct', {
                include: [
                    {
                        model: models.Product,
                        attributes: ['id', 'name', 'slug'],
                    },
                ],
            })
            models.Review.addScope('withUser', {
                include: [
                    {
                        model: models.User,
                        attributes: ['id', 'email', 'firstName', 'lastName'],
                    },
                ],
            })
        }
    }

    Review.registerDenormalizerTask(
        new ProductDenormalizationTask()
            .on(['rate', 'content'])
            .from((review) => {
                return review.getProduct()
            }),
    )

    Review.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            rate: DataTypes.INTEGER,
            content: DataTypes.STRING,
            approved: DataTypes.BOOLEAN,
            productId: DataTypes.INTEGER,
            userId: DataTypes.INTEGER,
            updatedAt: DataTypes.DATE,
            createdAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Review',
        },
    )

    return Review
}

export default model
