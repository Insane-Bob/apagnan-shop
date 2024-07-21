'use strict'
import { QueryTypes } from 'sequelize'
import slugify from 'slugify'
import { DenormalizableModel } from '../../lib/Denormalizer/DenormalizableModel.js'
import { ProductDenormalizationTask } from '../../lib/Denormalizer/tasks/ProductDenormalizationTask.js'
import { NotificationsServices } from '../../Services/NotificationsServices.js'

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

            Product.hasMany(models.ProductImage, {
                foreignKey: 'productId',
                as: 'images',
            })

            Product.hasMany(models.OrderDetail, {
                foreignKey: 'productId',
            })
            Product.hasMany(models.StockTransaction, {
                foreignKey: 'productId',
            })
        }

        static hooks(models) {
            models.Product.addHook('afterCreate', (product) => {
                if (product.published)
                    NotificationsServices.notifyNewProductInCollection(product)
            })

            models.Product.addHook('afterUpdate', (product) => {
                if (product.changed('published') && product.published)
                    NotificationsServices.notifyNewProductInCollection(product)
                if (product.changed('price'))
                    NotificationsServices.notifyProductPriceUpdate(product)
            })
        }

        static addScopes(models) {
            models.Product.addScope('withImages', {
                include: {
                    model: models.ProductImage,
                    as: 'images',
                },
            })
            models.Product.addScope('withCollection', {
                include: {
                    model: models.Collection,
                },
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

            mainImage:{
                type: DataTypes.VIRTUAL,
                get() {
                    if (this.images && this.images.length > 0) {
                        return this.images[0]
                    }
                    return null
                }
            }
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
