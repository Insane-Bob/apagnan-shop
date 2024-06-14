import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'

export class ReviewController extends Controller {
    review /** @provide by ReviewProvider */
    product /** @provide by ProductProvider */
    async getReviews() {
        const reviews = await this.product.getReviews()
        this.res.json({
            reviews: reviews,
        })
    }

    async getReview() {
        const review = this.review
        this.res.json({
            review: review,
        })
    }

    async createReview() {
        const review = await Database.getInstance().models.Review.create(
            this.req.body,
        )
        this.res.json({
            review: review,
        })
    }

    async updateReview() {
        const review = this.review
        await review.update(this.req.body)
        this.res.json({
            review: review,
        })
    }

    async deleteReview() {
        const review = this.review
        await review.destroy()
        this.res.json({
            review: review,
        })
    }
}
