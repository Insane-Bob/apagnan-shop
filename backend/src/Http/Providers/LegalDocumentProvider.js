import { Provider } from '../../Core/Provider.js'

export class LegalDocumentProvider extends Provider {
    static param = 'document'
    static model = 'LegalDocument'

    fetch(model, paramValue) {
        return model.findOne({
            where: { slug: paramValue },
        })
    }
}
