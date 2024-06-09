import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'

export class ProductController extends Controller {
    async getProducts() {
        const products = await Database.getInstance().models.Product.findAll()
        this.res.json({
            products: products,
        })
    }

    async getProduct() {
        const product = this.product
        const specifics = await Database.getInstance().models.Specific.findAll({
            where: {
                productId: product.id,
            },
        })
        const images = await Database.getInstance().models.Upload.findAll({
            where: {
                modelId: product.id,
                modelType: 'product',
            },
        })
        this.res.json({
            product: product,
            specifics: specifics,
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
                modelType: 'product',
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
        if (this.req.files && this.req.files.length > 0) {
            const imagePaths = this.req.files.map((file) => ({
                modelId: product.id,
                modelType: 'product',
                imagePath: file.path,
            }))
            await Database.getInstance().models.Upload.bulkCreate(imagePaths)
        }
        await product.update(this.req.body)
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
