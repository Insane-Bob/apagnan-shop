import { Controller } from '../../Core/Controller.js'
import { Database } from '../../Models/index.js'

export class ReviewController extends Controller {
    product /** @provide by ProductProvider */
    async getReviews() {
        if (this.product) {
            this.res.json({
                reviews: await this.product.getReviews(),
            })
        } else {
            const reviews = await Database.getInstance().models.Review.findAll()
            this.res.json({
                reviews: reviews,
            })
        }
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
