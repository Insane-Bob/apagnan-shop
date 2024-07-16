import { Provider } from '../../Core/Provider.js'

export class OrderProvider extends Provider {
    static param = 'order'
    static model = 'Order'

    fetch(model, paramValue,request){
        if(request.query.has('withProducts')){
            return model.unscoped().scope('withProducts').findByPk(paramValue)
        } else return super.fetch(model,paramValue,request)
    }
}
