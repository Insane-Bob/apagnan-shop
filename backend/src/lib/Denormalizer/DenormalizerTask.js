import { Database } from '../../Models/index.js'

export class DenormalizerTask {
    static EVENT = {
        CREATED: 'created',
        UPDATED: 'updated',
        DELETED: 'deleted',
    }
    constructor() {
        this.collectionString = null
        this.fethingFrom = null
        this.onChanges = []
        this._when = [
            DenormalizerTask.EVENT.CREATED,
            DenormalizerTask.EVENT.UPDATED,
            DenormalizerTask.EVENT.DELETED,
        ]
        this.event = DenormalizerTask.EVENT.CREATED
    }

    on(changes) {
        this.onChanges = changes
        return this
    }

    when(events) {
        this.when = events
        return this
    }

    checkChanges(instance, event) {
        if (this._when.indexOf(event) === -1) return false
        if (!this.onChanges.length) return true
        const checks = this.onChanges.map((c) => instance.changed(c))
        return checks.some((c) => c === true)
    }
    setEventType(event) {
        this.event = event
    }

    in(collection) {
        this.collectionString = collection
        return this
    }

    from(callable) {
        this.fethingFrom = callable
        return this
    }

    async fetch(ids) {
        throw new Error('Not implemented')
    }
    _instanceToIds(instance) {
        if (instance instanceof Array) {
            return instance.map((i) => i.id)
        }
        return [instance.id]
    }

    async execute(instance) {
        try {
            console.time('DenormalizerTask')
            console.log('Denormalizing', this.collectionString)
            if (this.fethingFrom) {
                instance = await this.fethingFrom(instance)
            }
            const instances = await this.fetch(this._instanceToIds(instance))

            if (!instances) throw new Error('Targeted instances are not found')
            if (!this.collectionString)
                throw new Error('Collection is not defined')

            let model = Database.getInstance().mongoModel(
                this.collectionString,
                this.constructor.schema,
            )
            for (let instance of instances) {
                await this.persist(model, instance)
            }
        } catch (e) {
            console.error('An error occured during denormalization', e)
        } finally {
            console.timeEnd('DenormalizerTask')
        }
    }

    async persist(model, instance) {
        await model.findOneAndReplace(
            {
                id: instance.id,
            },
            instance.toJSON(),
            {
                upsert: true,
            },
        )
    }
}
