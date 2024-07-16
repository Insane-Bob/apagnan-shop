import setUpApp from './app.js'
import { Database } from './Models/index.js'
import { Scheduler } from './lib/Scheduler.js'
import { ProductBasketCleanerJob } from './Jobs/ProductBasketCleanerJob.js'
import { CalculateStockByDate } from './Jobs/CalculateStockByDate.js'
;(async () => {
    console.log('Database is initializing...')
    await Database.initialize()

    setUpApp().then((app) => {
        app.listen(3000, () => {
            console.log('Server is running on port 3000')
        })
    })

    const scheduler = Scheduler.getInstance()
    scheduler.everyMinute(1, new ProductBasketCleanerJob()).now()
    scheduler.daily(new CalculateStockByDate()).now()
})()
