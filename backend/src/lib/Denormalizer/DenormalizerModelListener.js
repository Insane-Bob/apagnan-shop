import {DenormalizerQueue} from "./DenormalizerQueue.js";

export class DenormalizerModelListener {
    constructor(model) {
        this.model = model
        if(this.denormalizersTasks.length > 0) this.listen()
    }

    /**
     *
     * @returns {DenormalizerTask}
     */
    get denormalizersTasks(){
        return this.model?.getSelfDenormalizerTask ? this.model.getSelfDenormalizerTask() : []
    }
    runTasks(instance){
        let queue = DenormalizerQueue.getInstance()
        this.denormalizersTasks.map(t => {
            if(!t.checkChanges(instance)) return false
            return queue.enqueue({
                execute : () => t.execute.call(t,instance),
            })
        })
        return true
    }

    async afterCreate(instance){
        return this.runTasks(instance)
    }

    async afterBulkCreate(instances){
        return Promise.all(instances.map(i => this.runTasks(i)))
    }

    async afterUpdate(instance){
        return this.runTasks(instance)
    }

    async afterBulkUpdate(query){
        const instances = await this.model.findAll(query)
        return Promise.all(instances.map(i => this.runTasks(i)))
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

    listen(){
        console.log("Listen model for denormalization :", this.model.name)
        this.model.afterCreate(this.afterCreate.bind(this))

        this.model.afterBulkCreate(this.afterBulkCreate.bind(this))

        this.model.afterUpdate(this.afterUpdate.bind(this))

        this.model.afterBulkUpdate(this.afterBulkUpdate.bind(this))

        // this.model.beforeDestroy(this.beforeDestroy.bind(this))
        //
        // this.model.beforeBulkDestroy(this.beforeBulkDestroy.bind(this))
    }

    destroy(){
        this.model.removeHook('afterCreate')
        this.model.removeHook('afterBulkCreate')
        this.model.removeHook('afterUpdate')
        this.model.removeHook('afterBulkUpdate')
        // this.model.removeHook('beforeDestroy')
        // this.model.removeHook('beforeBulkDestroy')
    }
}