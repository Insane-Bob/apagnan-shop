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
                modelName: 'collection',
            },
        })
        this.res.json({
            collection: collection,
            image: image,
        })
    }

    async createCollection() {
        const collection =
            await Database.getInstance().models.Collection.create(
                this.req.body.all(),
            )
        if (this.req.file) {
            await Database.getInstance().models.Upload.create({
                modelId: collection.id,
                modelName: 'collection',
                imagePath: this.req.file.path,
            })
        }
        this.res.json({
            collection: collection,
        })
    }

    async updateCollection() {
        const collection = this.collection
        if (this.req.file) {
            // Delete previous image if exists
            await Database.getInstance().models.Upload.destroy({
                where: {
                    modelId: collection.id,
                    modelName: 'collection',
                },
            })

            await Database.getInstance().models.Upload.create({
                modelId: collection.id,
                modelName: 'collection',
                imagePath: this.req.file.path,
            })
        }
        await collection.update(this.req.body.all())

        await collection.save()
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
