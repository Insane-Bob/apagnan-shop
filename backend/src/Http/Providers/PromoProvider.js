import { Provider } from '../../Core/Provider.js'
import { Op } from 'sequelize'

export class PromoProvider extends Provider {
    static param = 'promo'
    static model = 'Promo'
}

export class PromoCodeProvider extends Provider {
    static param = 'code'
    static model = 'Promo'

    fetch(model, paramValue) {
        return model.findOne({
            where: {
                code: paramValue,
                available: true,
            },
        })
    }
}