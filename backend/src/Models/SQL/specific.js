'use strict'
import { DenormalizableModel } from '../../lib/Denormalizer/DenormalizableModel.js'
import { ProductDenormalizationTask } from '../../lib/Denormalizer/tasks/ProductDenormalizationTask.js'

function model(sequelize, DataTypes) {
    class Specific extends DenormalizableModel {
        static associate(models) {
            models.Specific.belongsTo(models.Product, {
                foreignKey: 'productId',
            })
        }
    }

    Specific.registerDenormalizerTask(
        new ProductDenormalizationTask()
            .on(['name', 'content'])
            .from((specific) => {
                return specific.getProduct()
            }),
    )

    Specific.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: DataTypes.STRING,
            content: DataTypes.STRING,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            productId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Specific',
        },
    )
    return Specific
}

export default model
