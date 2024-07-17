import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { PromoValidator } from '../../Validator/PromoValidator.js'
import { SearchRequest } from '../../lib/SearchRequest.js'
import { PromoPolicy } from '../Policies/PromoPolicy.js'
import { Op } from 'sequelize'

export class PromoController extends Controller {
    promo /** @provide by PromoProvider */
    async index() {
        this.can(PromoPolicy.index)

        let search = new SearchRequest(
            this.req,
            ['type', 'available', 'promoted'],
            [],
        )

        const data = await Database.getInstance().models.Promo.findAll(
            search.query,
        )
        const total = await Database.getInstance().models.Promo.count(
            search.queryWithoutPagination,
        )

        this.res.json({
            data,
            total,
        })
    }

    async getPromoted() {
        const data = await Database.getInstance().models.Promo.findAll({
            where: {
                promoted: true,
                available: true,
                endDate: {
                    [Op.gt]: new Date(),
                },
            },
        })

        this.res.json({
            data,
        })
    }

    async create() {
        this.can(PromoPolicy.update)

        this.validate(PromoValidator, PromoValidator.create())

        const props = this.req.body.all()

        if (props.endDate) {
            props.endDate = new Date(props.endDate)
        }

        const promo = await Database.getInstance().models.Promo.create(props)

        if (promo) {
            this.res.status(201).json({
                promo: promo,
            })
        }
    }

    async update() {
        this.can(PromoPolicy.update)

        this.validate(PromoValidator, PromoValidator.update())

        const props = this.req.body.all()

        if (props.endDate) {
            props.endDate = new Date(props.endDate)
        }

        const rowsEdited = await this.promo.update(props)

        if (rowsEdited === 0) {
            NotFoundException.abort()
        }

        this.res.json(this.promo)
    }

    async delete() {
        this.can(PromoPolicy.update)

        const rowsDeleted = await this.promo.destroy()

        if (rowsDeleted === 0) {
            NotFoundException.abort()
        }

        this.res.status(204).send()
    }
}
