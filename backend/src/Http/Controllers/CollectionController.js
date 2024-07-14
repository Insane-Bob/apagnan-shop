import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { CollectionPolicy } from '../Policies/CollectionPolicy.js'
import { CollectionValidator } from '../../Validator/CollectionValidator.js'

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
        this.can(CollectionPolicy.update)
        const payload = this.validate(CollectionValidator)
        const collection =
            await Database.getInstance().models.Collection.create(payload)
        /* if (this.req.file) {
            await Database.getInstance().models.Upload.create({
                modelId: collection.id,
                modelName: 'collection',
                imagePath: this.req.file.path,
            })
        } */
        this.res.json({
            collection: collection,
        })
    }

    async updateCollection() {
        this.can(CollectionPolicy.update)
        const collection = this.collection
        const payload = this.validate(CollectionValidator)
        /* if (this.req.file) {
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
        } */
        await collection.update(payload)

        await collection.save()
        this.res.json({
            collection: collection,
        })
    }

    async deleteCollection() {
        this.can(CollectionPolicy.delete)
        const collection = this.collection
        await collection.destroy()
        this.res.json({
            collection: collection,
        })
    }
}
