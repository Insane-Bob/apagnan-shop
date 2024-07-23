import { Database } from '../Models/index.js'
import { QueryTypes } from 'sequelize'

export class ProductServices {
    static async loadRemainingStock(products) {
        if (Array.isArray(products)) {
            await Promise.all(products.map((product) => product.getStock()))
        } else {
            await products.getStock()
        }
        return products
    }

    static async getPricesRange() {
        const products = await Database.getInstance().models.Product.findAll({
            attributes: ['price'],
        })
        let min = Math.min(...products.map((product) => product.price))
        let max = Math.max(...products.map((product) => product.price))
        return { min, max }
    }

    static async syncImages(product, imagesIds = null) {
        if (!imagesIds) return product
        await Database.getInstance().models.ProductImage.destroy({
            where: {
                productId: product.id,
            },
        })
        await Database.getInstance().models.ProductImage.bulkCreate(
            imagesIds.map((uploadId) => ({
                productId: product.id,
                uploadId,
            })),
        )
        return product
    }

    static async getProductListIdWhereStockIsNotZero() {
        let sql =
            'select id from "Products" where id in (select "productId" from "StockTransactions" group by "productId" having sum(quantity) > 0)'
        const result = await Database.getInstance().sequelize.query(sql, {
            type: QueryTypes.SELECT,
        })
        const ids = result.map((item) => item.id)
        return ids
    }
}
