import { DenormalizerQueue } from './DenormalizerQueue.js'
import { DenormalizerTask } from './DenormalizerTask.js'

export class DenormalizerModelListener {
    constructor(model) {
        this.model = model
        if (this.denormalizersTasks.length > 0) this.listen()
    }

    /**
     *
     * @returns {DenormalizerTask}
     */
    get denormalizersTasks() {
        return this.model?.getSelfDenormalizerTask
            ? this.model.getSelfDenormalizerTask()
            : []
    }
    runTasks(instance, event) {
        let queue = DenormalizerQueue.getInstance()
        let tasks = this.denormalizersTasks.map(async (t) => {
            t.setEventType(event)
            if (!t.checkChanges(instance, event)) return false
            return await queue.enqueue({
                execute: () => t.execute.call(t, instance),
            })
        })
        return Promise.all(tasks)
    }

    async afterCreate(instance) {
        return await this.runTasks(instance, DenormalizerTask.EVENT.CREATED)
    }

    async afterBulkCreate(instances) {
        return await Promise.all(
            instances.map((i) =>
                this.runTasks(i, DenormalizerTask.EVENT.CREATED),
            ),
        )
    }

    async afterUpdate(instance) {
        return await this.runTasks(instance, DenormalizerTask.EVENT.UPDATED)
    }

    async afterBulkUpdate(query) {
        const instances = await this.model.findAll(query)
        return await Promise.all(
            instances.map((i) => {
                i.changed = (attr) =>
                    Object.keys(query.attributes).includes(attr)
                return this.runTasks(i, DenormalizerTask.EVENT.UPDATED)
            }),
        )
    }

    async beforeDestroy(instance) {
        /**
         * @type {Awaited<{task:DenormalizerTask, instances: Object[]}>}
         */
        let tasksWithInstancesBeforeDestroy = await Promise.all(
            this.denormalizersTasks.map(async (task) => {
                return {
                    task,
                    instances: await task.getInstances(instance),
                }
            }),
        )
        this.model.afterDestroy(async () => {
            let queue = DenormalizerQueue.getInstance()
            for (let { task, instances } of tasksWithInstancesBeforeDestroy) {
                let newTask = new task.constructor()
                newTask.setEventType(DenormalizerTask.EVENT.DELETED)
                await queue.enqueue({
                    execute: () => newTask.execute.call(newTask, instances),
                })
            }
            this.model.removeHook('afterDestroy')
        })
    }

    async beforeBulkDestroy(query) {
        let instances = await this.model.findAll(query)
        let tasksWithInstancesBeforeDestroy = await Promise.all(
            this.denormalizersTasks.map(async (task) => {
                return {
                    task,
                    instances: (
                        await Promise.all(
                            instances.map((i) => task.getInstances(i)),
                        )
                    ).flat(),
                }
            }),
        )
        this.model.afterBulkDestroy(async () => {
            let queue = DenormalizerQueue.getInstance()
            for (let { task, instances } of tasksWithInstancesBeforeDestroy) {
                let newTask = new task.constructor()
                newTask.setEventType(DenormalizerTask.EVENT.DELETED)
                await queue.enqueue({
                    execute: () => newTask.execute.call(newTask, instances),
                })
            }
            this.model.removeHook('afterBulkDestroy')
        })
    }

    listen() {
        this.model.afterCreate(this.afterCreate.bind(this))

        this.model.afterBulkCreate(this.afterBulkCreate.bind(this))

        this.model.afterUpdate(this.afterUpdate.bind(this))

        this.model.afterBulkUpdate(this.afterBulkUpdate.bind(this))

        this.model.beforeDestroy(this.beforeDestroy.bind(this))

        this.model.beforeBulkDestroy(this.beforeBulkDestroy.bind(this))
    }

    destroy() {
        this.model.removeHook('afterCreate')
        this.model.removeHook('afterBulkCreate')
        this.model.removeHook('afterUpdate')
        this.model.removeHook('afterBulkUpdate')
        this.model.removeHook('beforeDestroy')
        this.model.removeHook('beforeBulkDestroy')
    }
}
