'use strict'
import slugify from 'slugify'
import { DenormalizableModel } from '../../lib/Denormalizer/DenormalizableModel.js'
import { ProductDenormalizationTask } from '../../lib/Denormalizer/tasks/ProductDenormalizationTask.js'

function model(sequelize, DataTypes) {
    class Collection extends DenormalizableModel {
        static associate(models) {
            models.Collection.belongsTo(models.Upload, {
                foreignKey: 'imageId',
                as: 'image',
            })
            models.Collection.hasMany(models.Product, {
                foreignKey: 'collectionId',
            })
        }

        static addScopes(models) {
            models.Collection.addScope('withImage', {
                include: [
                    {
                        model: models.Upload,
                        as: 'image',
                    },
                ],
            })
            models.Collection.addScope('withProducts', {
                include: {
                    model: models.Product,
                    include:{
                        association: 'images'
                    }
                },
            })
        }
    }

    Collection.registerDenormalizerTask(
        new ProductDenormalizationTask()
            .on(['name', 'slug', 'description', 'published', 'promoted'])
            .from((collection) => {
                return collection.getProducts()
            }),
    )

    Collection.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: DataTypes.STRING,
            slug: DataTypes.STRING,
            description: DataTypes.STRING,
            published: DataTypes.BOOLEAN,
            promoted: DataTypes.BOOLEAN,
            imageId: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Collection',
            hooks: {
                beforeCreate: (collection) => {
                    collection.slug = slugify(collection.name, { lower: true })
                },
                beforeUpdate: (collection) => {
                    collection.slug = slugify(collection.name, { lower: true })
                },
            },
        },
    )
    return Collection
}

export default model
