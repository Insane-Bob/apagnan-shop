import { Controller } from '../../Core/Controller.js'
import { SearchValidator } from '../../Validator/SearchValidator.js'
import { FrontFilterValidator } from '../../Validator/FrontFilterValidator.js'
import { Database } from '../../Models/index.js'
import { SearchPolicy } from '../Policies/SearchPolicy.js'
import { ProductServices } from '../../Services/ProductServices.js'

export class SearchController extends Controller {
    get collectionsToSearch() {
        return [
            Database.getInstance().mongoModels.Users,
            Database.getInstance().mongoModels.Orders,
            Database.getInstance().mongoModels.Products,
        ]
    }

    async makeQuery(
        collection,
        searchString,
        matchCustom = [],
        authorizeEmpty = false,
    ) {
        let attributes = collection.searchAttributes.map((attr) => attr.name)
        function escapeRegExp(string) {
            return string.trim().replaceAll(/[.*+?^${}()|[\]\\]/g, '\\$&')
        }
        let regexString = escapeRegExp(searchString).replace(/\s+/g, '|')
        if (regexString.length === 0 && !authorizeEmpty) return []

        let matchOrClause = attributes.map((attribute) => {
            return {
                [attribute]: {
                    $regex: regexString,
                    $options: 'i',
                },
            }
        })

        const pipeline = [
            {
                $match: {
                    $and: [
                        {
                            $or: matchOrClause,
                        },
                        ...matchCustom,
                    ],
                },
            },
            {
                $addFields: {
                    concatenatedFields: {
                        $concat: attributes.map((attr) => ({
                            $cond: {
                                if: {
                                    $isArray: `$${attr}`,
                                },
                                then: {
                                    $reduce: {
                                        input: `$${attr}`,
                                        initialValue: '',
                                        in: {
                                            $concat: ['$$value', ' ', '$$this'],
                                        },
                                    },
                                },
                                else: `$${attr}`,
                            },
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
        ]

        return collection.aggregate(pipeline)
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

    async FrontProductSearch() {
        const { min, max } = await ProductServices.getPricesRange()
        const filters = this.validate(FrontFilterValidator)
        const results = await this.makeQuery(
            Database.getInstance().mongoModels.Products,
            filters.s || '',
            [
                filters.collection
                    ? {
                          'Collection.id': {
                              $in: filters.collection.map(Number),
                          },
                      }
                    : null,
                {
                    price: {
                        $gte: filters.priceMin || min,
                        $lte: filters.priceMax || max,
                    },
                },
            ].filter(Boolean),
            true,
        )

        this.res.json(results)
    }
}
