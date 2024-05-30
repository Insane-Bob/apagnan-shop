import {NotFoundException} from "../Exceptions/HTTPException.js";
import {Database} from "../Models/index.js";

export class Provider{
    static param = null
    static model = null

    async provide(request){
        if(!this.constructor.model)
            throw new Error('Model not defined')
        if(!this.constructor.param)
            throw new Error('Param not defined')


        const paramValue = request.params.get(this.constructor.param,null)
        if(!paramValue) return null

        const database = Database.getInstance()
        const resource = await database.models[this.constructor.model].findByPk(paramValue)

        NotFoundException.abortIf(!resource, `Resource [${this.constructor.param} : ${paramValue}] not found`)

        return resource
    }
}