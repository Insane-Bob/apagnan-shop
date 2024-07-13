'use strict'
import { QueryTypes } from 'sequelize'
import slugify from 'slugify'
import { DenormalizableModel } from '../../lib/Denormalizer/DenormalizableModel.js'
import { ProductDenormalizationTask } from '../../lib/Denormalizer/tasks/ProductDenormalizationTask.js'

function model(sequelize, DataTypes) {
    class Product extends DenormalizableModel {
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
            Product.hasMany(models.OrderDetail, {
                foreignKey: 'productId',
            })
            Product.hasMany(models.StockTransaction, {
                foreignKey: 'productId',
            })
        }

        async getStock() {
            const sql = `SELECT SUM(quantity) as stock FROM "StockTransactions" WHERE "productId" = :productId`
            const [result] = await sequelize.query(sql, {
                replacements: { productId: this.id },
                type: QueryTypes.SELECT,
            })
            this.stock = Number(result.stock)
            return Number(result.stock)
        }
    }

    Product.registerDenormalizerTask(new ProductDenormalizationTask())

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
            collectionId: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
            stock: {
                type: DataTypes.VIRTUAL,
            },
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
