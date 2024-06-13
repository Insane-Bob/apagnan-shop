import { Provider } from '../../Core/Provider.js'
import { UserProvider } from './UserProvider.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'
import { Database } from '../../Models/index.js'

export class CustomerProvider extends Provider {
    static param = 'customer'
    static model = 'Customer'

    getParamValue(request) {
        return request.params.get(UserProvider.param, null)
    }
    fetch(model, paramValue) {
        return model.findOne({
            where: { userId: paramValue },
        })
    }
}
