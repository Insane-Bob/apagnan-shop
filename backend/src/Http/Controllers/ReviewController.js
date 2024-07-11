import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'
import { NotFoundException } from '../../Exceptions/HTTPException.js'

export class ReviewController extends Controller {
    product /** @provide by ProductProvider */
    async getReviews() {
        if (this.product) {
            this.res.status(200).json({
                reviews: await this.product.getReviews(),
            })
        } else {
            const reviews = await Database.getInstance().models.Review.findAll()
            this.res.status(200).json({
                reviews: reviews,
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
        const review = await Database.getInstance().models.Review.create(
            this.req.body.all(),
        )
        if (review) {
            this.res.status(201).json({
                review: review,
            })
        }
    }

    async updateReview() {
        const rowsEdited = await this.review.update(this.req.body.all())

        NotFoundException.abortIf(!rowsEdited)

        this.res.status(200).json({
            review: review,
        })
    }

    async deleteReview() {
        const deleted = await this.review.destroy()

        NotFoundException.abortIf(!deleted)

        this.res.sendStatus(204)
    }
}
