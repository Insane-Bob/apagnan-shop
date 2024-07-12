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
        this.process().then()
        return true
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

    waitForEmptyQueue() {
        let emptyTry = 0
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (this.queue.length === 0) {
                    emptyTry++
                    if (emptyTry > 1) {
                        clearInterval(interval)
                        resolve()
                    }
                }
            }, 100)
        })
    }
}
