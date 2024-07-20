import { Controller } from '../../Core/Controller.js'
import { SearchValidator } from '../../Validator/SearchValidator.js'
import { Database } from '../../Models/index.js'
import { SearchPolicy } from '../Policies/SearchPolicy.js'

export class SearchController extends Controller {
    get collectionsToSearch() {
        return [
            Database.getInstance().mongoModels.Users,
            Database.getInstance().mongoModels.Orders,
            Database.getInstance().mongoModels.Products,
        ]
    }

    async makeQuery(collection, searchString) {
        let indexes = await collection.listIndexes()
        let textIndex = indexes.find((index) => index.key._fts === 'text')
        let attributes = Object.keys(textIndex.weights)
        function escapeRegExp(string) {
            return string.trim().replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
        }
        let regexString = escapeRegExp(searchString).replace(/\s+/g, '|')
        if (regexString.length === 0) return []

        let matchOrClause = attributes.map((attribute) => {
            return {
                [attribute]: {
                    $regex: regexString,
                    $options: 'i',
                },
            }
        })

        return collection.aggregate([
            {
                $match: {
                    $or: matchOrClause,
                },
            },
            {
                $addFields: {
                    concatenatedFields: {
                        $concat: attributes.map((attr) => ({
                            $ifNull: [`$${attr}`, ''],
                        })),
                    },
                },
            },
            {
                $addFields: {
                    score: {
                        $cond: {
                            if: {
                                $regexMatch: {
                                    input: '$concatenatedFields',
                                    regex: regexString,
                                    options: 'i',
                                },
                            },
                            then: {
                                $divide: [
                                    { $strLenCP: searchString },
                                    { $strLenCP: '$concatenatedFields' },
                                ],
                            },
                            else: 0,
                        },
                    },
                },
            },
            {
                $sort: { score: -1 },
            },
            {
                $limit: 10,
            },
            {
                $project: {
                    concatenatedFields: 0,
                },
            },
        ])
    }

    async search() {
        this.can(SearchPolicy.search)
        const { s: searchString } = this.validate(SearchValidator)

        const res = await Promise.all(
            this.collectionsToSearch.map((collection) => {
                return this.makeQuery(collection, searchString)
            }),
        )

        let contact = [
            ...res[0].map((user) => ({
                type: 'user',
                ...user,
            })),
            ...res[1].map((order) => ({
                type: 'order',
                ...order,
            })),
            ...res[2].map((product) => ({
                type: 'product',
                ...product,
            })),
        ].sort((a, b) => b.score - a.score)

        this.res.json(contact)
    }
}
