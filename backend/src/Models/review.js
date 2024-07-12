'use scrict'
import { DenormalizableModel } from '../lib/Denormalizer/DenormalizableModel.js'
import { ProductDenormalizationTask } from '../lib/Denormalizer/tasks/ProductDenormalizationTask.js'

function model(sequelize, DataTypes) {
    class Review extends DenormalizableModel {
        static associate(models) {
            Review.belongsTo(models.Product, {
                foreignKey: 'productId',
            })
            Review.belongsTo(models.User, {
                foreignKey: 'userId',
            })
        }
    }

    Review.registerDenormalizerTask(
      new ProductDenormalizationTask()
        .on(['rate','content'])
        .from((review)=>{
          return {
            id:review.getProduct()
          }
        })
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
