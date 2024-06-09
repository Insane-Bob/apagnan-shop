import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'

export class CollectionController extends Controller {
    async getCollections() {
        const collections =
            await Database.getInstance().models.Collection.findAll()

        this.res.json({
            collections: collections,
        })
    }

    async getCollection() {
        const collection = this.collection
        const image = await Database.getInstance().models.Upload.findOne({
            where: {
                modelId: collection.id,
                modelType: 'collection',
            },
        })
        this.res.json({
            collection: collection,
            image: image,
        })
    }

    async createCollection() {
        const collection =
            await Database.getInstance().models.Collection.create(this.req.body)
        if (this.req.files && this.req.files.length > 0) {
            const imagePaths = this.req.files.map((file) => ({
                modelId: collection.id,
                modelType: 'collection',
                imagePath: file.path,
            }))
            await Database.getInstance().models.Upload.bulkCreate(imagePaths)
        }
        this.res.json({
            collection: collection,
        })
    }

    async updateCollection() {
        const collection = this.collection
        if (this.req.files && this.req.files.length > 0) {
            const imagePaths = this.req.files.map((file) => ({
                modelId: collection.id,
                modelType: 'collection',
                imagePath: file.path,
            }))
            await Database.getInstance().models.Upload.bulkCreate(imagePaths)
        }
        await collection.update(this.req.body)
        this.res.json({
            collection: collection,
        })
    }

    async deleteCollection() {
        const collection = this.collection
        await collection.destroy()
        this.res.json({
            collection: collection,
        })
    }
}
