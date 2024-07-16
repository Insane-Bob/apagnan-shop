import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { CollectionPolicy } from '../Policies/CollectionPolicy.js'
import { SearchRequest } from '../../lib/SearchRequest.js'

export class CollectionController extends Controller {
    async getCollections() {
        let search = new SearchRequest(this.req, ['published'], ['name'])

        const data = await Database.getInstance().models.Collection.findAll(
            search.query,
        )
        const total = await Database.getInstance().models.Collection.count(
            search.queryWithoutPagination,
        )

        const collections =
            await Database.getInstance().models.Collection.findAll()

        this.res.json({
            data: data,
            total: total,
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

    async getPromotedCollection() {
        const collection =
            await Database.getInstance().models.Collection.findOne({
                where: {
                    promoted: true,
                },
                include: [
                    {
                        model: Database.getInstance().models.Product,
                        include: [
                            {
                                model: Database.getInstance().models.Upload,
                                as: 'images',
                            },
                        ],
                    },
                    {
                        model: Database.getInstance().models.Upload,
                        as: 'image',
                    },
                ],
            })

        this.res.json({
            collection: collection,
        })
    }

    async createCollection() {
        this.can(CollectionPolicy.update)
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
        this.can(CollectionPolicy.update)
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
        this.can(CollectionPolicy.delete)
        const collection = this.collection
        await collection.destroy()
        this.res.json({
            collection: collection,
        })
    }
}
