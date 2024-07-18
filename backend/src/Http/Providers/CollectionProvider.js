import { Provider } from '../../Core/Provider.js'

export class CollectionProvider extends Provider {
    static param = 'collection'
    static model = 'Collection'

    fetch(model, paramValue, request) {
        if (request.query.has('withProducts'))
            model = model.scope('withProducts')
        return model.findOne({
            where: { slug: paramValue },
        })
    }
}
