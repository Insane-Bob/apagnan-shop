import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'
import { ReviewValidator } from '../../Validator/ReviewValidator.js'
import { SearchRequest } from '../../lib/SearchRequest.js'

export class ReviewController extends Controller {
    product /** @provide by ProductProvider */
    async getReviews() {
        console.log('here')
        if (this.product) {

            const data = await Database.getInstance().models.Review.findAll({
                where: {
                    approved: true,
                    productId: this.product.id,
                },
                include: [
                    {
                        model: Database.getInstance().models.User,
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                ],
            })

            this.res.status(200).json({
                reviews: data,
            })
        } else {
            let search = new SearchRequest(
                this.req,
                ['rate', 'approved', 'productId', 'userId'],
                ['content'],
            )
            let model = Database.getInstance().models.Review

            const scopes = []
            if (this.req.query.has('withProduct')) {
                scopes.push('withProduct')
            }
            if (this.req.query.has('withUser')) {
                scopes.push('withUser')
            }

            if (scopes.length > 0) {
                model = model.scope(scopes)
            }
            const total = await model.count(search.queryWithoutPagination)
            let query = { ...search.query }
            const data = await model.findAll(query)
            this.res.status(200).json({
                data: data,
                total: total,
            })
        }
    }

    async getReview() {
        const review = this.review

        NotFoundException.abortIf(!review)

        this.res.status(200).json({
            review: review,
        })
    }

    async createReview() {
        this.req.body.userId = this.req.user.id
        const payload = this.validate(ReviewValidator)
        const review =
            await Database.getInstance().models.Review.create(payload)
        if (review) {
            this.res.status(201).json({
                review: review,
            })
        }
    }

    async updateReview() {
        const payload = this.validate(ReviewValidator)
        const rowsEdited = await this.review.update(payload)

        NotFoundException.abortIf(!rowsEdited)

        this.res.status(200).json({
            review: this.review,
        })
    }

    async deleteReview() {
        const deleted = await this.review.destroy()

        NotFoundException.abortIf(!deleted)

        this.res.sendStatus(204)
    }
}
