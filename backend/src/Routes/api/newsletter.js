import { NewsletterController } from '../../Http/Controllers/NewsletterController.js'

export default function (router) {
    router.group('/api/newsletter', function () {
        this.post('/subscribe', NewsletterController, 'subscribe')
        this.post('/unsubscribe', NewsletterController, 'unsubscribe')
    })
}
