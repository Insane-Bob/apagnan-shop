import { ReviewController } from '../../Http/Controllers/ReviewController.js'
import { ReviewProvider } from '../../Http/Providers/ReviewProvider.js'

/**
 * Auth routes
 * @param {Router} router
 */

export default function (router) {
    router
        .group('/api/reviews', function () {
            this.get('/', ReviewController, 'getReviews')
            this.get('/:review', ReviewController, 'getReview')
            this.post('/', ReviewController, 'createReview')
            this.patch('/:review', ReviewController, 'updateReview')
            this.delete('/:review', ReviewController, 'deleteReview')
        })
        .provide(ReviewProvider)
}
