import {Database} from "../../Models/index.js";

export class DenormalizerTask{
    constructor()
    {
        this.collectionString = null;
        this.fethingFrom = null
        this.onChanges = []
    }

    on(changes){
        this.onChanges = changes
        return this
    }

    checkChanges(instance){
        if(!this.onChanges.length) return true
        const checks = this.onChanges.map(c => instance.changed(c))
        return checks.some(c => c === true)
    }

    in(collection){
        this.collectionString = collection
        return this
    }

    from(callable){
        this.fethingFrom = callable
        return this
    }

    async fetch(ids){
        throw new Error("Not implemented")
    }
    _instanceToIds(instance){
        if(instance instanceof Array){
            return instance.map(i => i.id)
        }
        return [instance.id]
    }

    async execute(instance){
        try{
            console.time("DenormalizerTask")
            console.log("Denormalizing", this.collectionString)
            if(this.fethingFrom) {
                instance = await this.fethingFrom(instance)
            }
            const instances = await this.fetch(this._instanceToIds(instance))


            if(!instances) throw new Error("Targeted instances are not found")
            if(!this.collectionString) throw new Error("Collection is not defined")

            let model = Database.getInstance().mongoDB.model(this.collectionString, this.constructor.schema)
            for(let instance of instances){
                await model.findOneAndReplace(
                  {
                      id: instance.id
                  },
                  instance.toJSON(),
                  {
                      upsert: true,
                  }
                );
            }

        }catch (e){
            console.error("An error occured during denormalization", e)
        }finally {
            console.timeEnd("DenormalizerTask")
        }
    }
}