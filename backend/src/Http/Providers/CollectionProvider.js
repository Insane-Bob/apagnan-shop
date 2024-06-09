import { Provider } from '../../Core/Provider.js'

export class CollectionProvider extends Provider {
    static param = 'collection'
    static model = 'Collection'

    fetch(model, paramValue) {
        return model.findOne({
            where: { slug: paramValue },
        })
    }
}
