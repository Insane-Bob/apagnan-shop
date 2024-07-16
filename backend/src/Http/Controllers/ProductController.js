import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'
import { ProductServices } from '../../Services/ProductServices.js'
import { ProductPolicy } from '../Policies/ProductPolicy.js'
import { ProductStockObserver } from '../../Observers/ProductStockObserver.js'

export class ProductController extends Controller {
    collection /** @provide by CollectionProvider */
    async getProducts() {
        const products = this.collection
            ? await this.collection.getProducts()
            : await Database.getInstance().models.Product.findAll()
        await ProductServices.loadRemainingStock(products)

        const images = await Database.getInstance().models.Upload.findAll({
            where: {
                modelId: products.map((product) => product.id),
                modelName: 'product',
            },
        })

        this.res.status(200).json({
            products,
            images,
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
        this.can(ProductPolicy.update)
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
        this.can(ProductPolicy.update)
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
        this.can(ProductPolicy.delete)
        const deleted = await this.product.destroy()
        NotFoundException.abortIf(!deleted)
        this.res.sendStatus(204)
    }

    async streamStock() {
        this.res.writeHead(200, {
            Connection: 'keep-alive',
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/event-stream',
        })

        this.product = await ProductServices.loadRemainingStock(this.product)
        const observer = ProductStockObserver.getInstance()
        const callback = (product) => {
            if (Number(product.id) != Number(this.product.id)) return
            this.res.write(product.stock.toString() + '\n')
        }

        observer.subscribe(callback)

        this.res.write(this.product.stock.toString() + '\n')
        this.res.on('close', () => {
            observer.unsubscribe(callback)
            this.res.end()
        })
    }
}
