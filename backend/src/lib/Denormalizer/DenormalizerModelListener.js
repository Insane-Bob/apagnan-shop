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
            if (!t.checkChanges(instance, event)) return false
            t.setEventType(event)
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

    // a deporter dans une autre classe ce n'est pas de la denormalisation
    // async beforeDestroy(instance){
    //     //return this.denormalizersTasks.map(t => t.collection.deleteOne({ _id: instance.id }))
    // }
    //
    // async beforeBulkDestroy(query){
    //     //const instances = await this.model.findAll(query)
    //     //return Promise.all(instances.map(i => this.denormalizersTasks.map(t => t.collection.deleteOne({ _id: i.id })))
    // }

    listen() {
        console.log('Listen model for denormalization :', this.model.name)
        this.model.afterCreate(this.afterCreate.bind(this))

        this.model.afterBulkCreate(this.afterBulkCreate.bind(this))

        this.model.afterUpdate(this.afterUpdate.bind(this))

        this.model.afterBulkUpdate(this.afterBulkUpdate.bind(this))

        // this.model.beforeDestroy(this.beforeDestroy.bind(this))
        //
        // this.model.beforeBulkDestroy(this.beforeBulkDestroy.bind(this))
    }

    destroy() {
        this.model.removeHook('afterCreate')
        this.model.removeHook('afterBulkCreate')
        this.model.removeHook('afterUpdate')
        this.model.removeHook('afterBulkUpdate')
        // this.model.removeHook('beforeDestroy')
        // this.model.removeHook('beforeBulkDestroy')
    }
}
