import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { ProductServices } from '../../Services/ProductServices.js'

export class ProductController extends Controller {
    collection /** @provide by CollectionProvider */
    async getProducts() {
        const products = this.collection ? await this.collection.getProducts() : await Database.getInstance().models.Product.findAll()
        await ProductServices.loadRemainingStock(products)
        this.res.json({
            products,
        })
    }

    async getProduct() {
        const product = this.product
        await ProductServices.loadRemainingStock(product)
        const images = await Database.getInstance().models.Upload.findAll({
            where: {
                modelId: product.id,
                modelName: 'product',
            },
        })
        this.res.json({
            product: product,
            images: images,
        })
    }

    async createProduct() {
        const product = await Database.getInstance().models.Product.create(
            this.req.body,
        )
        if (this.req.files && this.req.files.length > 0) {
            const imagePaths = this.req.files.map((file) => ({
                modelId: product.id,
                modelName: 'product',
                imagePath: file.path,
            }))
            await Database.getInstance().models.Upload.bulkCreate(imagePaths)
        }
        this.res.json({
            product: product,
        })
    }

    async updateProduct() {
        const product = this.product
        await product.update(this.req.body)
        if (this.req.files && this.req.files.length > 0) {
            const imagePaths = this.req.files.map((file) => ({
                modelId: product.id,
                modelName: 'product',
                imagePath: file.path,
            }))
            await Database.getInstance().models.Upload.bulkCreate(imagePaths)
        }
        this.res.json({
            product: product,
        })
    }

    async deleteProduct() {
        const product = this.product
        await product.destroy()
        this.res.json({
            product: product,
        })
    }
}
