export class ProductServices {
    static async loadRemainingStock(products) {
        if (Array.isArray(products)) {
            await Promise.all(
                products.map((product) => product.getRemainingStock()),
            )
        } else {
            await products.getRemainingStock()
        }
        return products
    }
}
