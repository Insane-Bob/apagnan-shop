import { Database } from '../../Models/index.js'

export class Factory {
    static model = null
    static _count = 1
    static instanciate() {
        throw new Error('instanciate method not implemented')
    }
    static async afterCreate(instance) {
        return instance
    }
    static getModel() {
        return Database.getInstance().models[this.model]
    }

    static getDefault(obj) {
        return this.instanciate(obj)
    }

    static count(count) {
        this._count = count
        return this
    }

    static async create(obj = {}) {
        let instances = []
        for (let i = 0; i < this._count; i++) {
            instances.push(await this.createInstance(obj))
        }
        return this._count == 1 ? instances[0] : instances
    }

    static async createInstance(obj = {}) {
        let payload = {
            ...(await this.getDefault()),
            ...obj,
        }
        const instance = await this.getModel().create(payload)
        await this.afterCreate(instance)
        return instance
    }
}
