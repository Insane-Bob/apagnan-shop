import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'
import { ProductServices } from '../../Services/ProductServices.js'
import { ProductPolicy } from '../Policies/ProductPolicy.js'
import { ProductValidator } from '../../Validator/ProductValidator.js'
import { ProductStockObserver } from '../../Observers/ProductStockObserver.js'
import { SearchRequest } from '../../lib/SearchRequest.js'
import { ProductDeleteValidator } from '../../Validator/ProductDeleteValidator.js'
import { StockService } from '../../Services/StockService.js'

export class ProductController extends Controller {
    collection /** @provide by CollectionProvider */
    async getProducts() {
        let products
        let total
        if (this.collection) {
            products = await this.collection.getProducts()
            total = products.length
        } else {
            let search = new SearchRequest(
                this.req,
                ['published', 'id'],
                ['name'],
            )

            let model = Database.getInstance().models.Product
            total = await model.count(search.queryWithoutPagination)

            let scopes = []

            if (this.req.query.has('withCollection'))
                scopes.push('withCollection')
            if (this.req.query.has('withImages')) scopes.push('withImages')

            let query = { ...search.query }
            if (this.req.query.has('random')) {
                query.limit = search.query.limit || 1
                query.offset = Math.floor(
                    Math.random() * (total - search.query.limit),
                )
            }

            products = await model.scope(scopes).findAll(query)
        }

        await ProductServices.loadRemainingStock(products)

        this.res.status(200).json({
            data: products,
            total: total,
        })
    }

    async getProduct() {
        const product = this.product
        await ProductServices.loadRemainingStock(product)
        NotFoundException.abortIf(!product)

        this.res.status(200).json({
            product: product,
        })
    }

    async createProduct() {
        this.can(ProductPolicy.update)
        const payload = this.validate(ProductValidator)
        const product =
            await Database.getInstance().models.Product.create(payload)
        await ProductServices.syncImages(product, payload.imagesIds)
        if (payload.stock)
            await StockService.addStock(product.id, payload.stock)
        if (product) {
            this.res.status(201).json({
                product: product,
            })
        }
    }

    async updateProduct() {
        this.can(ProductPolicy.update)
        const payload = this.validate(ProductValidator)
        await this.product.update(payload)
        await ProductServices.syncImages(this.product, payload.imagesIds)
        this.res.status(200).json({
            product: this.product,
        })
    }

    async deleteProduct() {
        this.can(ProductPolicy.delete)
        const deleted = await this.product.destroy()
        NotFoundException.abortIf(!deleted)
        this.res.sendStatus(204)
    }

    async massDelete() {
        this.can(ProductPolicy.delete)
        const { ids } = this.validate(ProductDeleteValidator)
        const deleted = await Database.getInstance().models.Product.destroy({
            where: { id: ids },
        })
        this.res.status(200).json({ deleted: deleted })
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
            this.res.write(
                `data: ${JSON.stringify({ stock: product.stock })}\n\n`,
            )
        }

        observer.subscribe(callback)

        this.res.write(
            `data: ${JSON.stringify({ stock: this.product.stock })}\n\n`,
        )
        this.res.on('close', () => {
            observer.unsubscribe(callback)
            this.res.end()
        })
    }

    async getPricesRange() {
        const { min, max } = await ProductServices.getPricesRange()
        this.res.status(200).json({
            min,
            max,
        })
    }
}
