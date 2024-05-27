export class Denormalizer{
    constructor(){
        this.model = null
        this.document = null
        this.mongoCollection = null

        this.afterCreate = async (instance, options) => {
            const document = await this.document.loadFromInstance(instance)
            await this.mongoCollection.insertOne(await document.format())
        }

        this.afterBulkCreate = async (instances, options) => {
            await Promise.all(instances.map(async instance => {
                const document = await this.document.loadFromInstance(instance)
                await this.mongoCollection.insertOne(await document.format())
            }))
        }

        this.afterUpdate = async (instance, options) => {
            const document = await this.document.loadFromInstance(instance)
            await this.mongoCollection.replaceOne({id: instance.id}, await document.format())
        }

        this.afterBulkUpdate = async (options) => {
            let instances = await this.model.findAll({where: options.where})
             await Promise.all(instances.map(async instance => {
                const document = await this.document.loadFromInstance(instance)
                let format = await document.format()
                await this.mongoCollection.updateOne({id: instance.id}, {
                    $set: format
                })
            }))
        }

        this.beforeDestroy = async (instance, options) => {
            await this.mongoCollection.deleteOne({id: instance.id})
        }

        this.beforeBulkDestroy = async (options) => {
            let instances = await this.model.findOne({where: options.where})
            await Promise.all(instances.map(async instance => {
                await this.mongoCollection.deleteOne({id: instance.id})
            }))
        }
    }

    setAfterCreate(afterCreate){
        this.afterCreate = afterCreate
    }
    setAfterBulkCreate(afterBulkCreate){
        this.afterBulkCreate = afterBulkCreate
    }
    setAfterUpdate(afterUpdate){
        this.afterUpdate = afterUpdate
    }
    setAfterBulkUpdate(afterBulkUpdate){
        this.afterBulkUpdate = afterBulkUpdate
    }
    setBeforeDestroy(beforeDestroy){
        this.beforeDestroy = beforeDestroy
    }
    setBeforeBulkDestroy(beforeBulkDestroy){
        this.beforeBulkDestroy = beforeBulkDestroy
    }

    /**
     *
     * @param {Model} model
     * @returns {Denormalizer}
     */
    from(model){
        this.model = model
        return this
    }
    to(document){
        this.document = document
        return this
    }
    in(mongoCollection){
        this.mongoCollection = mongoCollection
        return this
    }
    listen(){
        if(!this.model || !this.document || !this.mongoCollection)
            throw new Error('Model and Document must be set')

        this.model.afterCreate(this.afterCreate.bind(this))

        this.model.afterBulkCreate(this.afterBulkCreate.bind(this))

        this.model.afterUpdate(this.afterUpdate.bind(this))

        this.model.afterBulkUpdate(this.afterBulkUpdate.bind(this))

        this.model.beforeDestroy(this.beforeDestroy.bind(this))

        this.model.beforeBulkDestroy(this.beforeBulkDestroy.bind(this))
    }
}