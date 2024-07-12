'use strict'
import slugify from 'slugify'
import { DenormalizableModel } from '../lib/Denormalizer/DenormalizableModel.js'
import { ProductDenormalizationTask } from '../lib/Denormalizer/tasks/ProductDenormalizationTask.js'

function model(sequelize, DataTypes) {
    class Collection extends DenormalizableModel {
        static associate(models) {
            Collection.hasOne(models.Upload, {
                foreignKey: 'modelId',
                constraints: false,
                scope: {
                    modelName: 'collection',
                },
                as: 'image',
            })
            Collection.hasMany(models.Product, {
                foreignKey: 'collectionId',
            })
        }
    }

    Collection.registerDenormalizerTask(
      new ProductDenormalizationTask()
        .on(['name','slug','description','published','promoted'])
        .from((collection) => {
          return collection.getProducts()
        })
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
