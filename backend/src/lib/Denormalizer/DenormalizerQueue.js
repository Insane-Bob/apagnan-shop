export class DenormalizerQueue {
    static instance = null
    static getInstance() {
        if (!DenormalizerQueue.instance) {
            DenormalizerQueue.instance = new DenormalizerQueue()
        }
        return DenormalizerQueue.instance
    }

    constructor() {
        this.queue = []
        this.started = false
    }

    /**
     * @param {DenormalizerTask} task
     */
    async enqueue(task) {
        this.queue.push(task)
        await this.process()
    }

    async process() {
        if (process.env.NODE_ENV === 'test') return
        if (this.started) return
        this.started = true
        while (this.queue.length > 0) {
            let task = this.queue.shift()
            await task.execute()
        }
        this.started = false
    }
}
