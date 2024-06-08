
export class Document{

    static async loadFromInstance(modelInstance){
        return new Promise(async (resolve, reject)=>{
            if(!modelInstance) return resolve(null)
            let document = new this(modelInstance)
            try{
                await document.patch()
                resolve(document)
            }catch (e){
                reject(e)
            }
        })
    }

    static map(modelInstancesArray){
        return modelInstancesArray.map(modelInstance=>this.loadFromInstance(modelInstance))
    }

    static structure = {}
    constructor(modelInstance) {
        this.modelInstance = modelInstance
    }
    async patch(){
        throw new Error('Method not implemented');
    }

    async format(){
        let response = {}
        for(let key in this.constructor.structure){
            if(this[key] instanceof Promise){
                let document = await this[key]
                if(!document) {
                    response[key] = null
                    continue
                }
                response[key] = await document.format()
            }
            else if(this[key] instanceof Array && this[key].length && this[key][0] instanceof Promise) {
                let documents = await Promise.all(this[key])
                response[key] = await Promise.all(documents.filter(Boolean).map(document => document.format()))
            }else
                response[key] = this[key]
        }
        return response

    }
}