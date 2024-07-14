export class SearchRequest {
    /**
     * @param {Request} request
     * @param {Array<String>} keys
     */
    constructor(request, keys) {
        this.request = request
        this.keys = keys
    }

    get where() {
        const where = {}
        for (const key of this.keys) {
            if (this.request.query.has(key)) {
                where[key] = this.request.query.get(key)
            }
        }
        return where
    }

    get limit() {
        return this.request.query.get('limit', null)
    }

    get offset() {
        const page = this.request.query.get('page')
        if (!page) {
            return 0
        }
        return (page - 1) * this.limit
    }

    get order() {
        if (!this.request.query.has('order')) {
            return []
        }
        return [
            [
                this.request.query.get('order'),
                this.request.query.get('direction', 'ASC'),
            ],
        ]
    }

    get query() {
        return {
            where: this.where,
            limit: this.limit,
            offset: this.offset,
            order: this.order,
        }
    }

    get queryWithoutPagination() {
        return {
            where: this.where,
            order: this.order,
        }
    }
}
