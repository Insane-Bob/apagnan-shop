import { Database } from '../Models/index.js'

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
}
