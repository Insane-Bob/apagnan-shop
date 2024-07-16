import { Op } from 'sequelize'

export class SearchRequest {
    /**
     * @param {Request} request
     * @param {Array<String>} keys
     * @param {Array<String>} searchableFields
     */
    constructor(request, keys = [], searchableFields = []) {
        this.request = request
        this.searchableFields = searchableFields
        this.keys = keys
        this.include = []
        this.additionalWhere = {}
        this.replacements = {}
    }

    addInclude(model) {
        this.include.push(model)
    }

    addReplacement(key, value) {
        this.replacements[key] = value
    }
    addWhere(object) {
        this.additionalWhere = {
            ...this.additionalWhere,
            ...object,
        }
    }

    get where() {
        const where = {
            ...this.additionalWhere,
        }
        for (const key of this.keys) {
            if (this.request.query.has(key)) {
                let value = this.request.query.get(key)
                if (typeof value === 'string' && value.includes(',')) {
                    let arrayValue = value.split(',')
                    where[key] = {
                        [Op.in]: arrayValue,
                    }
                } else {
                    where[key] = value
                }
            }
        }

        if (
            this.request.query.has('search') &&
            this.request.query.get('search') !== ''
        ) {
            where[Op.or] = this.searchableFields.map((field) => {
                return {
                    [field]: {
                        [Op.iLike]: `%${this.request.query.get('search')}%`,
                    },
                }
            })
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
            ...this.queryWithoutPagination,
            limit: this.limit,
            offset: this.offset,
        }
    }

    get queryWithoutPagination() {
        return {
            where: this.where,
            order: this.order,
            include: this.include,
            replacements: this.replacements,
        }
    }
}
