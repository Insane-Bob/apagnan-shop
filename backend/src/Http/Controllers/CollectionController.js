import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { CollectionPolicy } from '../Policies/CollectionPolicy.js'
import { CollectionValidator } from '../../Validator/CollectionValidator.js'
import { SearchRequest } from '../../lib/SearchRequest.js'

export class CollectionController extends Controller {
    collection
    async getCollections() {
        let search = new SearchRequest(this.req, ['published'], ['name'])

        const model = Database.getInstance().models.Collection
        if (this.req.query.has('withImage')) model.scope('withImage')
        const total = await model.count(search.queryWithoutPagination)

        let query = { ...search.query }
        if (this.req.query.has('random')) {
            query.limit = search.query.limit || 1
            query.offset = Math.floor(
                Math.random() * (total - search.query.limit),
            )
        }

        const data = await model.findAll(query)

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

    async promoteCollection() {
        await Database.getInstance().models.Collection.update(
            {
                promoted: false,
            },
            {
                where: { promoted: true },
            },
        )

        const collection =
            await Database.getInstance().models.Collection.update(
                {
                    promoted: true,
                },
                {
                    where: { id: this.collection.id },
                },
            )

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
