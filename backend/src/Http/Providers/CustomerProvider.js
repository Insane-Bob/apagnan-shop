import {Provider} from "../../Core/Provider.js";
import {UserProvider} from "./UserProvider.js";
import {NotFoundException} from "../../Exceptions/HTTPException.js";
import {Database} from "../../Models/index.js";

export class CustomerProvider extends Provider{
    static param = 'customer'
    static model = 'Customer'

    async provide(request) {
        const userId = request.params.get(UserProvider.param, null)
        if(!userId) return null

        const database = Database.getInstance()
        const customer = await database.models[this.constructor.model].findOne({where: {userId: userId}})

        NotFoundException.abortIf(!customer, `Customer [${UserProvider.param} : ${userId}] not found`)
        return customer
    }
}