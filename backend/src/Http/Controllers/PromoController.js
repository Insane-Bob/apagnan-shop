import { Op } from 'sequelize'
import { Controller } from '../../Core/Controller.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'
import { Database } from '../../Models/index.js'
import { PromoServices } from '../../Services/PromoServices.js'
import { PromoValidator } from '../../Validator/PromoValidator.js'
import { SearchRequest } from '../../lib/SearchRequest.js'
import { PromoPolicy } from '../Policies/PromoPolicy.js'

export class PromoController extends Controller {
    promo /** @provide by PromoProvider */
    code /** @provide by PromoCodeProvider */
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

    async show() {
        const code = await Database.getInstance().models.Promo.findOne({
            where: {
                available: true,
                code: this.req.params.get('code'),
            },
        })

        NotFoundException.abortIf(!code)

        this.res.json({
            promo: code,
        })
    }

    async getPromoted() {
        const data = await Database.getInstance().models.Promo.findAll({
            where: {
                promoted: true,
                available: true,
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

        const couponProps = {
            duration: 'once',
        }
        if (props.type === 'amount') {
            couponProps.amount_off = props.value * 100
            couponProps.currency = 'eur'
        } else {
            couponProps.percent_off = props.value
        }

        const coupon = await PromoServices.createCoupon(couponProps)

        const promotionCodeProps = {
            coupon: coupon.id,
            code: props.code,
        }

        const promotionCode =
            await PromoServices.createpromotionCodes(promotionCodeProps)

        if (props.endDate) {
            props.endDate = new Date(props.endDate)
        }

        props.stripeId = promotionCode.id

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
}
