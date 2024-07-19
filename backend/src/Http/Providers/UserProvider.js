import { Provider } from '../../Core/Provider.js'

export class UserProvider extends Provider {
    static param = 'user_resource'
    static model = 'User'

    fetch(model, paramValue, request) {
        if (request.getUser()?.id == Number(paramValue)) {
            return model.findByPk(paramValue, {
                attributes: { exclude: ['password'] },
            })
        } else return super.fetch(model, paramValue)
    }
}
