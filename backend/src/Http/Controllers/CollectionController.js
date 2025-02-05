import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { CollectionPolicy } from '../Policies/CollectionPolicy.js'
import { CollectionValidator } from '../../Validator/CollectionValidator.js'
import { SearchRequest } from '../../lib/SearchRequest.js'

export class CollectionController extends Controller {
    collection
    async getCollections() {
        let search = new SearchRequest(this.req, ['published','id'], ['name'])

        let model = Database.getInstance().models.Collection
        const scopes = []
        const conditions = {}
        if (this.req.query.has('withProductCount'))
            scopes.push('withProductCount')
        if (this.req.query.has('withImage')) scopes.push('withImage')
        if (this.req.query.has('published')) conditions.published = true

        model = model.scope(scopes)

        const total = await model.count(search.queryWithoutPagination)

        let query = { ...search.query }
        query.where = {
            ...query.where,
            ...conditions,
        }
        if (this.req.query.has('random')) {
            query.limit = search.query.limit || 1
            query.offset =
                total > search.query.limit
                    ? Math.floor(Math.random() * (total - search.query.limit))
                    : 0
        }

        const data = await model.findAll(query)

        this.res.json({
            data: data,
            total: total,
        })
    }

    async getCollection() {
        const collection = this.collection
        this.res.json({
            collection: collection,
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
                                association: 'images',
                            },
                        ],
                    },
                    {
                        association: 'image',
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
        this.res.json({
            collection: collection,
        })
    }

    async updateCollection() {
        this.can(CollectionPolicy.update)
        const collection = this.collection
        const payload = this.validate(CollectionValidator)
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
