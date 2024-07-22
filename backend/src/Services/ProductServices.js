import {Database} from "../Models/index.js";

export class ProductServices {
    static async loadRemainingStock(products) {
        if (Array.isArray(products)) {
            await Promise.all(products.map((product) => product.getStock()))
        } else {
            await products.getStock()
        }
        return products
    }

    static async syncImages(product,imagesIds = null){
        if(!imagesIds)
            return product
        await Database.getInstance().models.ProductImage.destroy({
            where:{
                productId:product.id
            }
        })
        await Database.getInstance().models.ProductImage.bulkCreate(
            imagesIds.map((uploadId)=>({
                productId:product.id,
                uploadId
            }))
        )
        return product
    }
}
