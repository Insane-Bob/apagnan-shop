export class Scheduler {
    constructor(job, timeout) {
        this.job = job
        this.timeout = timeout
    }

    start() {
        console.time('Scheduler' + this.job.name + 'started in')
        this.job.execute().then(() => {
            console.timeEnd('Scheduler' + this.job.name + ' started in')
            setTimeout(() => this.start(), this.timeout)
        })
    }

    async stop() {
        console.time('Scheduler' + this.job.name + 'stopped in')
        clearTimeout(this.timeout)
        console.timeEnd('Scheduler' + this.job.name + ' stopped in')
    }
}
