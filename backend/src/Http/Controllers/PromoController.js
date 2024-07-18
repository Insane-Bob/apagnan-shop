import { object } from 'zod'
import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { PromoValidator } from '../../Validator/PromoValidator.js'
import { SearchRequest } from '../../lib/SearchRequest.js'
import { PromoPolicy } from '../Policies/PromoPolicy.js'
import { PromoServices } from '../../Services/PromoServices.js'
import { Op } from 'sequelize'
import { NotFoundException } from '../../Exceptions/HTTPException.js'

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
        const list = await PromoServices.listPromotionCodes()

        const promo = list.data.find((promo) => {
            console.log('list.promo.code', promo.code)
            console.log('this.req.params.code', this.req.params.get('code'))
            return promo.code === this.req.params.get('code')
        })

        NotFoundException.abortIf(!promo, 'Promo not found')

        this.res.json({
            promo: promo,
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

        const couponProps = {
            duration: 'once',
        }
        if (promo.type === 'amount') {
            couponProps.amount_off = promo.value
            couponProps.currency = 'eur'
        } else {
            couponProps.percent_off = promo.value
        }

        const coupon = await PromoServices.createCoupon(couponProps)

        console.log('AAAAAA', coupon)

        const promotionCodeProps = {
            coupon: coupon.id,
            code: promo.code,
        }

        const promotionCode =
            await PromoServices.createpromotionCodes(promotionCodeProps)

        console.log('BBBBBB', promotionCode)

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
