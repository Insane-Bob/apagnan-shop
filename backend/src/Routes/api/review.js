import { ReviewController } from '../../Http/Controllers/ReviewController.js'
import { ReviewProvider } from '../../Http/Providers/ReviewProvider.js'

/**
 * Auth routes
 * @param {Router} router
 */

export function reviewRoutes(router) {
    router
        .group('/reviews', function () {
            this.get('/', ReviewController, 'getReviews')
            this.get('/:review', ReviewController, 'getReview')
            this.post('/', ReviewController, 'createReview')
            this.put('/:review', ReviewController, 'updateReview')
            this.delete('/:review', ReviewController, 'deleteReview')
        })
        .provide(ReviewProvider)
}
