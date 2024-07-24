import { LegalDocumentProvider } from '../../Http/Providers/LegalDocumentProvider.js'
import { LegalDocumentController } from '../../Http/Controllers/LegalDocumentController.js'

export default function (router) {
    router
        .group('/api/legals-documents', function () {
            this.get('/', LegalDocumentController, 'index')
            this.get('/:document', LegalDocumentController, 'show')
            this.post('/', LegalDocumentController, 'store')
            this.patch('/:document', LegalDocumentController, 'update')
            this.delete('/:document', LegalDocumentController, 'delete')
        })
        .provide(LegalDocumentProvider)
}
