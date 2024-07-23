import { EmailController } from "../../Http/Controllers/EmailController.js"

export default function (router) {
    router.group('/api/emails', function () {
        this.get('/order-supported/:orderId', EmailController, 'sendOrderSupportedEmail')
    })
}
