import { Provider } from '../../Core/Provider.js'

export class CollectionProvider extends Provider {
    static param = 'collection'
    static model = 'Collection'

    fetch(model, paramValue, request) {
        if (request.query.has('withProducts'))
            model = model.scope('withProducts')
        if(request.query.has('withImage'))
            model = model.scope('withImage')
        return model.findOne({
            where: { slug: paramValue },
        })
    }
}
