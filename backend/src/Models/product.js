'use strict'
import { Model } from 'sequelize'
import slugify from 'slugify'

function model(sequelize, DataTypes) {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Collection, {
                foreignKey: 'collectionId',
            })
            Product.hasMany(models.Specific, {
                foreignKey: 'productId',
            })
            Product.hasMany(models.Review, {
                foreignKey: 'productId',
            })
            Product.hasMany(models.Upload, {
                foreignKey: 'modelId',
                constraints: false,
                scope: {
                    modelName: 'product',
                },
                as: 'images',
            })
        }
    }
    Product.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: DataTypes.STRING,
            slug: DataTypes.STRING,
            description: DataTypes.STRING,
            price: DataTypes.DECIMAL,
            published: DataTypes.BOOLEAN,
            stock: DataTypes.INTEGER,
            collectionId: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
        },
        {
            sequelize,
            modelName: 'Product',
            hooks: {
                beforeCreate: (product) => {
                    product.slug = slugify(product.name, { lower: true })
                },
                beforeUpdate: (product) => {
                    product.slug = slugify(product.name, { lower: true })
                },
            },
        },
    )
    return Product
}

export default model
