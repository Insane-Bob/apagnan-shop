export class ProductServices {
    static async loadRemainingStock(products) {
        if (Array.isArray(products)) {
            await Promise.all(products.map((product) => product.getStock()))
        } else {
            await products.getStock()
        }
        return products
    }
}
