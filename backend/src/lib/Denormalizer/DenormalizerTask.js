import { Database } from '../../Models/index.js'
import { DenormalizerExecption } from './DenormalizerExecption.js'

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
        const msg =
            'Denormalized ' +
            this.constructor.model +
            ' from ' +
            instance.constructor.name +
            ', done in'

        try {
            console.time(msg)
            if (this.fethingFrom) {
                instance = await this.fethingFrom(instance)
            }
            const instances = await this.fetch(this._instanceToIds(instance))

            if (!instances) throw new Error('Targeted instances are not found')
            if (!this.constructor.model)
                throw new Error('Mongo Model is not defined')

            let model =
                Database.getInstance().mongoModels[this.constructor.model]
            for (let instance of instances) {
                await this.persist(model, instance)
            }
        } catch (e) {
            this.onError(new DenormalizerExecption(this, instance, e))
        } finally {
            console.timeEnd(msg)
        }
    }

    onError(e) {
        if (process.env.NODE_ENV === 'test') throw e
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
