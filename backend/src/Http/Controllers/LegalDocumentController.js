import { Controller } from '../../Core/Controller.js'
import { LegalDocumentPolicy } from '../Policies/LegalDocumentPolicy.js'
import { Database } from '../../Models/index.js'
import { LegalDocumentValidator } from '../../Validator/LegalDocumentValidator.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'
import { SearchRequest } from '../../lib/SearchRequest.js'

export class LegalDocumentController extends Controller {
    document = null /** @provided by LegalDocumentProvider */
    async index() {
        this.can(LegalDocumentPolicy.index)

        const search = new SearchRequest(this.req)
        const conditions = {}
        if (this.req.query.has('published')) conditions.published = true
        let query = search.query
        query.where = {
            ...search.query.where,
            ...conditions,
        }

        const documents =
            await Database.getInstance().models.LegalDocument.findAll(query)
            
        const total = await Database.getInstance().models.LegalDocument.count(
            search.queryWithoutPagination,
        )

        this.res.json({
            data: documents,
            total,
        })
    }

    show() {
        NotFoundException.abortIf(
            !this.document.published,
            'Document not found',
        )
        return this.res.json(this.document)
    }

    async store() {
        this.can(LegalDocumentPolicy.index)
        const payload = this.validate(LegalDocumentValidator)
        const document =
            await Database.getInstance().models.LegalDocument.create(payload)

        this.res.json(document)
    }

    async update() {
        this.can(LegalDocumentPolicy.index)
        const payload = this.validate(LegalDocumentValidator)
        await this.document.update(payload)
        this.res.json(this.document)
    }

    async delete() {
        this.can(LegalDocumentPolicy.index)
        await this.document.destroy()
        this.res.sendStatus(204)
    }
}
