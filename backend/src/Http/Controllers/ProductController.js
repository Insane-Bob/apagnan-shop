import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'
import { ProductServices } from '../../Services/ProductServices.js'

export class ProductController extends Controller {
    collection /** @provide by CollectionProvider */
    async getProducts() {
        const products = this.collection
            ? await this.collection.getProducts()
            : await Database.getInstance().models.Product.findAll()
        await ProductServices.loadRemainingStock(products)
        this.res.status(200).json({
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
        NotFoundException.abortIf(!product)

        this.res.status(200).json({
            product: product,
            images: images,
        })
    }

    async createProduct() {
        // add validator --> if not validate return 422
        const product = await Database.getInstance().models.Product.create(
            this.req.body.all(),
        )
        if (this.req.files && this.req.files.length > 0) {
            const imagePaths = this.req.files.map((file) => ({
                modelId: product.id,
                modelName: 'product',
                imagePath: file.path,
            }))
            await Database.getInstance().models.Upload.bulkCreate(imagePaths)
        }
        if (product) {
            this.res.status(201).json({
                product: product,
            })
        }
    }

    async updateProduct() {
        const rowsEdited = await this.product.update(this.req.body.all())
        if (this.req.files && this.req.files.length > 0) {
            const imagePaths = this.req.files.map((file) => ({
                modelId: product.id,
                modelName: 'product',
                imagePath: file.path,
            }))
            await Database.getInstance().models.Upload.bulkCreate(imagePaths)
        }
        NotFoundException.abortIf(!rowsEdited)

        this.res.status(200).json({
            product: product,
        })
    }

    async deleteProduct() {
        const deleted = await this.product.destroy()

        NotFoundException.abortIf(!deleted)

        this.res.sendStatus(204)
    }
}
