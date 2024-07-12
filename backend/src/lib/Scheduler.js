import cron from 'node-cron'

export class Scheduler {
    static instance = null

    /**
     *
     * @returns {Scheduler}
     */
    static getInstance() {
        if (!Scheduler.instance) {
            Scheduler.instance = new Scheduler()
        }
        return Scheduler.instance
    }
    constructor() {
        this.jobs = []
    }
    schedule(cronExpression, jobClass, ...args) {
        console.log('Scheduling', jobClass.name, 'with', cronExpression)
        function jobFunction() {
            console.time('Scheduler' + jobClass.name + ' started in')
            jobClass
                .execute(...args)
                .then(() =>
                    console.timeEnd(
                        'Scheduler' + jobClass.name + ' started in',
                    ),
                )
        }
        const job = cron.schedule(cronExpression, jobFunction, {
            scheduled: true,
            timezone: 'Europe/Paris',
        })
        this.jobs.push(job)
        return job
    }

    monthly(...args) {
        return this.schedule('0 0 1 * *', ...args)
    }

    weekly(...args) {
        return this.schedule('0 0 * * 0', ...args)
    }

    daily(...args) {
        return this.schedule('0 0 * * *', ...args)
    }

    hourly(...args) {
        return this.schedule('0 * * * *', ...args)
    }

    everyMinute(minute, ...args) {
        return this.schedule(`*/${minute} * * * *`, ...args)
    }
}
