import { StatsController } from '../../Http/Controllers/StatsController.js'

export default function (router) {
    router.group('/api/stats', function () {
        this.get('/orders', StatsController, 'orderStats')
        this.get('/orders-taken', StatsController, 'orderTakeEvolution')
        this.get('/stock', StatsController, 'stockEvolution')
        this.get('/reviews', StatsController, 'reviewsStats')
        this.get('/refunds', StatsController, 'lastsRefundRequest')
        this.get('/incomes', StatsController, 'incomesEvolution')
    })
}
