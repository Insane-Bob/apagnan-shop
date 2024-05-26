export class Denormalizer{
    constructor(){
        this.model = null
        this.document = null
        this.mongoCollection = null
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

        this.model.afterCreate(async (instance, options) => {
            const document = await this.document.loadFromInstance(instance)
            await this.mongoCollection.insertOne(await document.format())
        })

        this.model.afterBulkCreate(async (instances, options) => {
            await Promise.all(instances.map(async instance => {
                const document = await this.document.loadFromInstance(instance)
                await this.mongoCollection.insertOne(await document.format())
            }))
        })

        this.model.afterUpdate(async (instance, options) => {
            const document = await this.document.loadFromInstance(instance)
            await this.mongoCollection.replaceOne({id: instance.id}, await document.format())
        })

        this.model.afterBulkUpdate(async (options) => {
            let instances = await this.model.findAll({where: options.where})
             await Promise.all(instances.map(async instance => {
                const document = await this.document.loadFromInstance(instance)
                let format = await document.format()
                await this.mongoCollection.updateOne({id: instance.id}, {
                    $set: format
                })
            }))

        })

        this.model.beforeDestroy(async (instance, options) => {
            await this.mongoCollection.deleteOne({id: instance.id})
        })

        this.model.beforeBulkDestroy(async (options) => {
            let instances = await this.model.findOne({where: options.where})
            await Promise.all(instances.map(async instance => {
                await this.mongoCollection.deleteOne({id: instance.id})
            }))
        })
    }
}