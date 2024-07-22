import { Provider } from '../../Core/Provider.js'

export class CollectionProvider extends Provider {
    static param = 'collection'
    static model = 'Collection'

    fetch(model, paramValue, request) {
        let scopes = []
        if (request.query.has('withProducts'))
            scopes.push('withProducts')
        if(request.query.has('withImage'))
            scopes.push('withImage')
        return model.scope(scopes).findOne({
            where: { slug: paramValue },
        })
    }
}
