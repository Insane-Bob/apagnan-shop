import { UploadController } from '../../Http/Controllers/UploadController.js'
import { AccessLinkMiddleware } from '../../Http/Middlewares/AccessLinkMiddleware.js'

export default function (router) {
    router.group('/api/uploads', function () {
        this.get('/:file', UploadController, 'show').middleware(
            AccessLinkMiddleware,
            100,
        )
    })
}
