import { NewsletterController } from '../../Http/Controllers/NewsletterController.js'
import { AccessLinkMiddleware } from '../../Http/Middlewares/AccessLinkMiddleware.js'

export default function (router) {
    router.group('/api/newsletter', function () {
        this.get('/', NewsletterController, 'index')
        this.post('/subscribe', NewsletterController, 'subscribe')
        this.post(
            '/unsubscribe',
            NewsletterController,
            'unsubscribe',
        ).middleware(AccessLinkMiddleware)
    })
}
