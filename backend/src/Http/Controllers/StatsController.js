import { Controller } from '../../Core/Controller.js'
import { StatsPolicies } from '../Policies/StatsPolicies.js'
import { StockEvolutionValidator } from '../../Validator/Stats/StockEvolutionValidator.js'
import { Database } from '../../Models/index.js'
import { CalculateStockByDate } from '../../Jobs/CalculateStockByDate.js'
import { PeriodValidator } from '../../Validator/Stats/PeriodValidator.js'
import { IntervalValidator } from '../../Validator/Stats/IntervalValidator.js'
import { OrderDenormalizationTask } from '../../lib/Denormalizer/tasks/OrderDenormalizationTask.js'
import { ProductDenormalizationTask } from '../../lib/Denormalizer/tasks/ProductDenormalizationTask.js'
import { OrderRefundRequestDenormalizationTask } from '../../lib/Denormalizer/tasks/OrderRefundRequestDenormalizationTask.js'
import { GraphServices } from '../../Services/GraphServices.js'

export class StatsController extends Controller {
    async orderStats() {
        this.can(StatsPolicies.view)
        const { start, end } = this.validate(PeriodValidator)
        const result =
            await Database.getInstance().mongoModels.Orders.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: start,
                            $lte: end,
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            status: '$status',
                        },
                        total: { $sum: '$total' },
                        count: { $sum: 1 },
                    },
                },
            ])

        return this.res.json(result)
    }

    async orderTakeEvolution() {
        this.can(StatsPolicies.view)
        const { start, end } = this.validate(PeriodValidator)
        const { interval } = this.validate(IntervalValidator)

        const result =
            await Database.getInstance().mongoModels.Orders.aggregate([
                GraphServices.filterDates(start, end),
                {
                    $sort: { createdAt: 1 },
                },
                {
                    $group: {
                        _id: GraphServices.getGroupBy(start, end, interval),
                        count: { $sum: 1 },
                    },
                },
            ])

        const formattedResult = GraphServices.fillMissingDates(
            result,
            start,
            end,
            interval,
        )

        this.res.json(formattedResult)
    }

    async incomesEvolution() {
        this.can(StatsPolicies.view)
        const { start, end } = this.validate(PeriodValidator)
        const { interval } = this.validate(IntervalValidator)

        const result =
            await Database.getInstance().mongoModels.Orders.aggregate([
                {
                    $match: {
                        status: {
                            $in: ['shipping', 'delivered'],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        createdAt: 1,
                        status: 1,
                        total: 1,
                    },
                },
                GraphServices.filterDates(start, end),
                {
                    $sort: { createdAt: 1 },
                },
                {
                    $group: {
                        _id: GraphServices.getGroupBy(start, end, interval),
                        count: { $sum: '$total' },
                    },
                },
            ])

        const formattedResult = GraphServices.fillMissingDates(
            result,
            start,
            end,
            interval,
        )

        this.res.json(formattedResult)
    }
    async stockEvolution() {
        this.can(StatsPolicies.view)
        const { productId } = this.validate(StockEvolutionValidator)
        const { start, end } = this.validate(PeriodValidator)
        const { interval } = this.validate(IntervalValidator)

        const aggregationPipeline = [
            GraphServices.filterDates(start, end, 'date', {
                productId,
            }),
            {
                $sort: { date: 1 },
            },
            {
                $group: {
                    _id: GraphServices.getGroupBy(
                        start,
                        end,
                        interval,
                        'date',
                        {
                            productId: '$productId',
                        },
                    ),
                    count: { $sum: '$quantityOfDay' },
                },
            },
        ]

        const result =
            await Database.getInstance().mongoModels.Stocks.aggregate(
                aggregationPipeline,
            )

        const formattedResult = GraphServices.fillMissingDates(
            result,
            start,
            end,
            interval,
        )

        this.res.json(formattedResult)
    }

    async reviewsStats() {
        this.can(StatsPolicies.view)

        const result =
            await Database.getInstance().mongoModels.Products.aggregate([
                {
                    $unwind: '$Reviews',
                },
                {
                    $addFields: {
                        'Reviews.productId': '$id',
                        'Reviews.productName': '$name',
                    },
                },
                {
                    $replaceRoot: {
                        newRoot: '$Reviews',
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $limit: 10,
                },
            ])

        const counts =
            await Database.getInstance().mongoModels.Products.aggregate([
                {
                    $unwind: '$Reviews',
                },
                {
                    $replaceRoot: {
                        newRoot: '$Reviews',
                    },
                },
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                    },
                },
            ])

        this.res.json({
            reviews: result,
            count: counts[0] ? counts[0].count : 0,
        })
    }
    async lastsRefundRequest() {
        this.can(StatsPolicies.view)

        const result =
            await Database.getInstance().mongoModels.Refunds.aggregate([
                {
                    $match: {
                        approved: false,
                    },
                },
                {
                    $sort: {
                        createdAt: -1,
                    },
                },
                {
                    $limit: 10,
                },
            ])

        this.res.json(result)
    }
}
