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
        let sql =
            'SELECT CAST(min(price) AS INTEGER) AS min, CAST(max(price) AS INTEGER) AS max FROM "Products"'
        const result = await Database.getInstance().sequelize.query(sql, {
            type: QueryTypes.SELECT,
        })

        const minPrice = parseInt(result[0].min)
        const maxPrice = parseInt(result[0].max)
        return { min: minPrice, max: maxPrice }
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
